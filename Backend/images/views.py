from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Image
from .serializers import ImageSerializer

class ImageViewSet(viewsets.ModelViewSet):
    serializer_class = ImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Image.objects.filter(user=self.request.user).order_by('order')

    def create(self, request, *args, **kwargs):
        images = request.FILES.getlist('image')
        titles = request.POST.getlist('title')
        
        if len(images) != len(titles):
            return Response({"error": "Number of images and titles do not match"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=[{"image": image, "title": title} for image, title in zip(images, titles)], many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['patch'])
    def reorder(self, request):
        ordered_images = request.data.get('ordered_images', [])
        with transaction.atomic():
            for index, image_data in enumerate(ordered_images):
                image = Image.objects.get(id=image_data['id'], user=request.user)
                image.order = index
                image.save()
        return Response({'status': 'Images reordered successfully'})

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)  # Always allow partial updates
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)