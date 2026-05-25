from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.base import ContentFile
import cv2
import numpy as np
import base64
import os
from django.conf import settings

class RegisterIris(APIView):
    def post(self, request):
        image_data = request.data.get('image')
        user_id = request.data.get('user_id')
        user_type = request.data.get('user_type')  # 'student' or 'teacher'

        if not image_data or not user_id:
            return Response({'error': 'Image and user_id required'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        # decoding iage from base64
        format, imgstr = image_data.split(';base64,')
        img_data = base64.b64decode(imgstr)
        
        # Saving the images to media/iris/ directory
        save_dir = os.path.join(settings.MEDIA_ROOT, 'iris')
        os.makedirs(save_dir, exist_ok=True)
        
        filename = f"{user_type}_{user_id}.png"
        filepath = os.path.join(save_dir, filename)
        
        with open(filepath, 'wb') as f:
            f.write(img_data)

        return Response({'message': 'Iris registered successfully!'})


class VerifyIris(APIView):
    def post(self, request):
        image_data = request.data.get('image')
        user_id = request.data.get('user_id')
        user_type = request.data.get('user_type')

        if not image_data or not user_id:
            return Response({'error': 'Image and user_id required'},
                          status=status.HTTP_400_BAD_REQUEST)

        # Base64 decode karo
        format, imgstr = image_data.split(';base64,')
        img_data = base64.b64decode(imgstr)
        
        # Live image numpy array mein convert karo
        nparr = np.frombuffer(img_data, np.uint8)
        live_img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)

        # Saved image load karo
        filename = f"{user_type}_{user_id}.png"
        filepath = os.path.join(settings.MEDIA_ROOT, 'iris', filename)

        if not os.path.exists(filepath):
            return Response({'match': False, 'message': 'Iris not registered!'})

        saved_img = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)

        # Resize karo same size mein
        live_img = cv2.resize(live_img, (200, 200))
        saved_img = cv2.resize(saved_img, (200, 200))

        # Compare karo
        difference = cv2.absdiff(live_img, saved_img)
        score = np.sum(difference)

        # Score kam ho toh match!
        if score < 3000000:
            return Response({'match': True, 'message': 'Iris matched! Access Granted '})
        else:
            return Response({'match': False, 'message': 'Iris not matched! Access Denied'})
