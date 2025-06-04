
import csv
import cs50
import requests

db = cs50.SQL('sqlite:///songs.db')

#r = requests.get('https://api.lyrics.ovh/v1/one%20republic/counting%20stars')
#print(r.content)

'''with open('new.csv', 'w') as file:
    with open('songList.csv', 'r') as songList:
        writer = csv.writer(file)
        songs = csv.DictReader(songList)
       # print(reader)
        #songs = db.execute('SELECT * FROM songs;')
        for song in songs:
            try:
                title = song['title']
                author = song['author']
                lyrics = requests.get(f'https://api.lyrics.ovh/v1/{author}/{title}').json()['lyrics']
                lyrics = lyrics.replace('\n\n', '\n').replace('\n', '<br>')
                writer.writerow([song['video_id'], title, author, lyrics])
            except Exception as e:
                print(f"Error: {e}")
                writer.writerow([song['video_id'], title, author, song['lyrics']])
            

        
        
'''
