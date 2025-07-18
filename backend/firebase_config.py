from firebase_admin import credentials, initialize_app, firestore

cred = credentials.Certificate("serviceAccountKey.json")
initialize_app(cred)
db = firestore.client()