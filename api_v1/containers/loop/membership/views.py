from rest_framework import viewsets
import api_v1.containers.loop.membership.serializers as serializers
from users.models import Membership

class MembershipViewSet(viewsets.ModelViewSet):
  serializer_class = serializers.MembershipSerializer
  http_method_names = ['get', 'head']

  def get_queryset(self):
    user = self.request.user
    groups = user.groups.all()
    memberships = Membership.objects.filter(group__in=groups)

    if (self.request.GET.get('loop')):
      group_id = self.request.GET.get('loop')
      memberships = memberships.filter(group__id=group_id)

    if (self.request.GET.get('user')):
      user_id = self.request.GET.get('user')
      memberships = memberships.filter(user__id=user_id)

    memberships = memberships.order_by('id').distinct('id')
    return memberships

  def create(self, user, group):
    # Add the current user information to the new loop
    user = request.user

    # Load the data into the serializer
    data = copy.deepcopy(request.data)
    data['user_id'] = user.id
    serializer = self.get_serializer(data=data)
    serializer.is_valid(raise_exception=True)

    self.perform_create(serializer)

    # Report success
    headers = self.get_success_headers(serializer.data)
    return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)