import requests
#from relay import *

while True:
    print('Please Input Code')
    code = input()

    r = requests.post(url='https://2762fb77.ngrok.io/get_locker', json={'code': int(code)})

    locker = r.json()['locker']

    if locker == 1:
        pin = 17
        #relay.motor_off(pin)
        #time.sleep(2)
        #relay.motor_on(pin)
        print('Locker 1 Opened!')
    elif locker == 2:
        pin = 18
        #relay.motor_off(pin)
        #time.sleep(2)
        #relay.motor_on(pin)
        print('Locker 2 Opened!')
    else:
        print('Wrong code, Please try again!')