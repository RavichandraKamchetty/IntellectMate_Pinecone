from sentence_transformers import SentenceTransformer
import numpy as np
embedding_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
# from sklearn.decomposition import PCA

def encode_features(story, major, hobbies, country, unique_quality):
    print('entered')
    embedding_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
    story_embeddings = embedding_model.encode(story)
    major_embedding = embedding_model.encode(major)
    hobbies_embedding = embedding_model.encode(hobbies)
    country_embedding = embedding_model.encode(country)
    unique_quality_embedding = embedding_model.encode(unique_quality)
    print('ended')
    
    features = np.mean([story_embeddings, major_embedding, hobbies_embedding, country_embedding, unique_quality_embedding], axis = 0)
    

    return features