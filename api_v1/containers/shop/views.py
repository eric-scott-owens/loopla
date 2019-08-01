import copy
from datetime import datetime
from django.contrib.auth.models import User
from django.conf import settings
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import stripe
from shop.models import Order, OrderStatusTransition, OrderItem, Kudos, KudosAvailable, CatalogItem

from api_v1.containers.shop.serializers import CreateNewOrderSerializer, OrderSerializer, ProcessOrderSerializer
from users.models import Person

@api_view(['POST'])
def create_order(request):
  data = copy.deepcopy(request.data)
  request_serializer = CreateNewOrderSerializer(data=data)
  request_serializer.is_valid(raise_exception=True)

  user = request.user
  person = Person.objects.get(user=user)

  try: 
    # Create the initial order
    items = []
    for order_item in data['order_items']:
      items.append({
        "type": 'sku',
        "parent": order_item['parent'],
        "quantity": order_item['quantity']
      })

    stripe.api_key = settings.STRIPE_PRIVATE_KEY
    stripe_order = stripe.Order.create(
      currency='usd',
      items=items,
      shipping={
        "name": '%s %s' % (user.first_name, user.last_name),
        "address":{
          "line1": person.address_line_1,
          "city": person.city,
          "state": person.state,
          "country": 'US',
          "postal_code": person.zipcode
        },
      },
      email= user.email
    )

    # Store the order data in our database
    order = Order(
      order_id = stripe_order.id,
      user = user,
      amount = stripe_order.amount,
      email = stripe_order.email,
      status = stripe_order.status,
      created = datetime.fromtimestamp(stripe_order.created),
      updated = datetime.fromtimestamp(stripe_order.updated)
    )
    order.currency = stripe_order.currency
    order.save()

    order_status = OrderStatusTransition(
      order = order,
      status = stripe_order.status,
      created = datetime.fromtimestamp(stripe_order.updated)
    )
    order_status.save()

    for item in stripe_order['items']:
      order_item = OrderItem(
        order = order,
        amount = item['amount'],
        description = item['description'],
        parent = item['parent'],
        quantity = item['quantity'],
        item_type = item['type']
      )
      order_item.currency = item.currency,
      order_item.save()

    updated_order = Order.objects.get(order_id=order.order_id)
    response_serializer = OrderSerializer(updated_order)
    return Response(response_serializer.data, status=status.HTTP_201_CREATED)

  except Exception as e:
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def process_order(request):
  data = copy.deepcopy(request.data)
  request_serializer = ProcessOrderSerializer(data=data)
  request_serializer.is_valid(raise_exception=True)

  try:
    user = request.user
    order = Order.objects.get(order_id=data['order_id'])
    stripe_token = data['stripe_token']

    if order.user != user:
      return Response(status=status.HTTP_403_FORBIDDEN)

    # Pay the order
    stripe.api_key = settings.STRIPE_PRIVATE_KEY
    stripe_order = stripe.Order.pay(order.order_id, source=stripe_token)

    # Record the results
    order.status = stripe_order.status
    order.updated = datetime.fromtimestamp(stripe_order.updated)
    order.charge = stripe_order.charge
    order.save()

    order_status = OrderStatusTransition(
      order = order,
      status = stripe_order.status,
      created = datetime.fromtimestamp(stripe_order.updated)
    )
    order_status.save()


    # Update Available Kudos
    kudos_types_ordered = {} # Dictionary keyed by kudos_id and valued by count of that kudos type ordered
    
    order_items = OrderItem.objects.filter(order_id=order.order_id)
    for item in order_items:
      if item.item_type == 'sku':
        catalog_item = CatalogItem.objects.get(sku=item.parent)

        # collect the kudos we need to make available
        for collection in catalog_item.collection.all():
          for kudos_id in collection.kudos_ids:
            ################################################################################
            ## This section should be identical to the handling for the kudos bellow 
            ################################################################################
            # if the kudos dictionary entry does not exists, add it with a count of quantity
            if kudos_id not in kudos_types_ordered:
              kudos_types_ordered[kudos_id] = item.quantity
            else:
              # else, increment the counter
              kudos_types_ordered[kudos_id] = kudos_types_ordered[kudos_id] + item.quantity
            ################################################################################
            ## End section

        for kudos in catalog_item.kudos.all():
          kudos_id = str(kudos.id)
          ################################################################################
          ## This section should be identical to the handling for the collections above
          ################################################################################
          # if the kudos dictionary entry does not exists, add it with a count of quantity
          if kudos_id not in kudos_types_ordered:
            kudos_types_ordered[kudos_id] = item.quantity
          else:
            # else, increment the counter
            kudos_types_ordered[kudos_id] = kudos_types_ordered[kudos_id] + item.quantity
          ################################################################################
          ## End section
    
    # Update ordering counts and available kudos
    for kudos_id in kudos_types_ordered:
      number_sold_now = kudos_types_ordered[kudos_id]
      kudos_number_sold = None
      updated_kudos = None

      # Updated kudos.number_sold
      with transaction.atomic():
        kudos = Kudos.objects.get(id=kudos_id)
        kudos.number_sold = kudos.number_sold + number_sold_now
        kudos.save()
        updated_kudos = Kudos.objects.get(id=kudos_id)
        kudos_number_sold = updated_kudos.number_sold

      # Start populating available kudos
      edition_number = kudos_number_sold - number_sold_now
      while edition_number < kudos_number_sold:
        edition_number = edition_number + 1
        kudos_available = KudosAvailable(
          user = user,
          kudos = updated_kudos,
          edition_number = edition_number,
          order = order
        )
        kudos_available.save()


    updated_order = Order.objects.get(order_id=order.order_id)
    response_serializer = OrderSerializer(updated_order)
    return Response(response_serializer.data, status=status.HTTP_202_ACCEPTED)
  except Exception as e:
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)