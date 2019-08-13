# LoRAPI
## Low Resistance API
This is an express project that offers basic RESTful to GET, PUT, POST and DELETE data.
resources routing are loaded dynamically.
Persistence is done by using fs having file per resource collection

### adding a new resource
run service by running:
> npm run dev
Assuming the service is running on http://localhost:3000
Post a request (using an app like Insomnia or Postman) to http://localhost:3000/resources
with a body like:
	{
		"resourceName": "theResourceName",
		"identifier": "id",
		"idGenType": "uuid"
  }
  
  - **identifier** is the name of the field 
  - **idGenType** can be either uuid or numeric
