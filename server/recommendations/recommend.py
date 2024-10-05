from dotenv import load_dotenv
import pinecone
import os

# Load environment variables from .env file
load_dotenv()
api_key = os.getenv('PINECONE_API_KEY')

# Create a Pinecone instance
pc = pinecone.Pinecone(api_key=api_key)

# Check if the index already exists, create it if it does not
index_name = 'intellectmate'
if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name, 
        dimension=384,  # Replace with the actual dimension of your embeddings
        metric='cosine',  # Replace with the metric you're using, e.g., 'euclidean', 'cosine', etc.
        spec=pinecone.ServerlessSpec(
            cloud='aws',  # Replace with your cloud provider, e.g., 'gcp', 'azure', etc.
            region='us-east-1'  # Replace with your desired region
        )
    )

# Use the index
index = pc.Index(index_name)

print(f"Pinecone API Key: {api_key}")

def recommend(features):
    result = index.query(
        vector=features.tolist(),
        top_k=10
    )
    print(result)
    userids = [match['id'] for match in result['matches']]
    return userids

def insert_user_features(userid, features):
    index.upsert(vectors = [(str(userid), features.tolist())])
    return


