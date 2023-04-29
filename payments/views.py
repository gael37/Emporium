from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect
from rest_framework.exceptions import NotFound, ValidationError

from .serializers.common import PaymentSerializer

from rest_framework.permissions import IsAuthenticatedOrReadOnly

import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeCheckoutView(APIView):

    def post(self, request):
      print(request.POST)

      # payment_to_add = PaymentSerializer(data=request.data)
      try:
        # when passing data into a serializer we get access to the is_valid() method that returns true if valid, false if not. Below we use this in an if statement, if it returns true we will save the data and send back to the user. If it fails we will send the errors back instead
        # if payment_to_add.is_valid():
        #     # if it hits here, the data passed was valid and we can now save as send a response
        #     print(payment_to_add.validated_data)
        #     # the save() method can be run on a serializer instance that has a validated_data key
        #     payment_to_add.save()
            # Once saved, we get a data key on the instance that contains the newly created record
            line_array=[]
            for k, v in request.POST.items():
                print(k, v)
                line_array.append({
                    'price': k,
                    'quantity': v,
                    })
            # line_array.append({
            #             'price': request.POST['name0'],
            #             # 'price': 'price_1N0UO2JkvqlqJ3ZhPHmx6Dab',
            #             'quantity': request.POST['quantity0'],
            #             # 'quantity': '1',
            #         })
            # line_array.append({
            #             'price': request.POST['name1'],
            #             # 'price': 'price_1N0UO2JkvqlqJ3ZhPHmx6Dab',
            #             'quantity': request.POST['quantity1'],
            #             # 'quantity': '1',
            #         })
            # line_array.append({
            #             'price': request.POST['name2'],
            #             # 'price': 'price_1N0UO2JkvqlqJ3ZhPHmx6Dab',
            #             'quantity': request.POST['quantity2'],
            #             # 'quantity': '1',
            #         })
            checkout_session = stripe.checkout.Session.create(
                  line_items=line_array,
                # line_items=[
                #     {
                #         'price': request.POST['name0'],
                #         # 'price': 'price_1N0UO2JkvqlqJ3ZhPHmx6Dab',
                #         'quantity': request.POST['quantity0'],
                #         # 'quantity': '1',
                #     },
                #     {
                #         'price': request.POST['name1'],
                #         # 'price': 'price_1N0UO2JkvqlqJ3ZhPHmx6Dab',
                #         'quantity': request.POST['quantity1'],
                #         # 'quantity': '1',
                #     },
                #     {
                #         'price': request.POST['name2'],
                #         # 'price': 'price_1N0UO2JkvqlqJ3ZhPHmx6Dab',
                #         'quantity': request.POST['quantity2'],
                #         # 'quantity': '1',
                #     },
                # ],
                payment_method_types=['card',],
                mode='payment',
                success_url=settings.SITE_URL + '/success?success=true&session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.SITE_URL + '/cancel?canceled=true',
            )

            return redirect(checkout_session.url)

        # print(payment_to_add.errors)
        # return Response(payment_to_add.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
      except:
            return Response(
                {'error': 'Something went wrong when creating stripe checkout session'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
          
