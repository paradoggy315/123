from ..db import execute_procedure

def add_shipping_details(pledge_id, response_id, carrier, tracking_number, shipping_date):
    return execute_procedure(
        'AddShippingDetails', 
        (pledge_id, response_id, carrier, tracking_number, shipping_date)
    )
