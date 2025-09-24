
import csv
import cs50
import requests
import time

db = cs50.SQL('sqlite:///songs.db')

def clean(text):
    return text.replace('\x00', '') if text else text


# Gets from lyrics.ovh api
with open('new.csv') as file:
    for line in file:
        line = line.split(',')
        if(len(line) == 3):
            title = line[0]
            author = line[1].replace('\n', '')
            try:
                y = 10/0
                lyrics = requests.get(f'https://api.lyrics.ovh/v1/{author}/{title}').json()['lyrics']
                lyrics = lyrics.replace('\n\n', '\n').replace('\n', '<br>')
                
            except Exception as e:
                lyrics = 'Error getting lyrics'
            
            videoId = clean(line[2])
            title = clean(title)
            author = clean(author)
            lyrics = clean(lyrics)

            print('Inserting ' + title + ' by ' + author + ' with ID ' + videoId)
            db.execute('INSERT INTO songs (video_id, title, author, lyrics) VALUES (?, ?, ?, ?);', videoId, title, author, lyrics)
