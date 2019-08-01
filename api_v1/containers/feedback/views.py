import copy, operator
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response 
from django.http import JsonResponse
from dashboard.models import UserFeedback
from api_v1.containers.feedback.serializers import UserFeedbackSerializer

class UserFeedbackViewSet(viewsets.ModelViewSet):
  serializer_class = UserFeedbackSerializer

  def get_queryset(self):
    return_feedback = UserFeedback.objects.all()
    if(self.request.GET.get('id')):
        userId = self.request.GET.get('id')
        return_feedback = return_feedback.filter(owner_id=userId).distinct('id')
        return return_feedback
    return return_feedback


  @staticmethod
  def decode_base64_file(data):

    def get_file_extension(file_name, decoded_file):
      import imghdr

      extension = imghdr.what(file_name, decoded_file)
      extension = "jpg" if extension == "jpeg" else extension

      return extension

    from django.core.files.base import ContentFile
    import base64
    import six
    import uuid

    # Check if this is a base64 string
    if isinstance(data, six.string_types):
      # Check if the base64 string is in the "data:" format
      if 'data:' in data and ';base64,' in data:
        # Break out the header from the base64 content
        header, data = data.split(';base64,')

      # Try to decode the file. Return validation error if it fails.
      try:
        decoded_file = base64.b64decode(data)
      except TypeError:
        TypeError('invalid_image')

      # Generate file name:
      file_name = str(uuid.uuid4())[:12] # 12 characters are more than enough.
      # Get the file name extension:
      file_extension = get_file_extension(file_name, decoded_file)

      complete_file_name = "%s.%s" % (file_name, file_extension, )

      return ContentFile(decoded_file, name=complete_file_name)


    def create(self, request, *args, **kwargs):
        data = copy.deepcopy(request.data)
        data.pop('id', None)

        # Load the data into the serializer
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        #Create the new object
        self.perform_create(serializer)

        # Report success
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
