import requests
import cs50
import re
import random
from bs4 import BeautifulSoup

db = cs50.SQL('sqlite:///songs.db')

def getLyrics(title, author):
    # If already in database, fetch the lyrics
    if len(db.execute('SELECT * FROM songs WHERE title = ? and author = ?;', title.lower(), author.lower())) > 0:
        return db.execute('SELECT lyrics FROM songs WHERE title = ? and author = ?;', title.lower(), author.lower())[0]['lyrics']
    
    title = ''.join([i for i in title.lower() if i.isalpha() or i.isnumeric()])
    author = ''.join([i for i in author.lower() if i.isalpha() or i.isnumeric()])
    
    # Else, get lyrics from the website
    url = f'https://www.azlyrics.com/lyrics/{author}/{title}.html'
    try:
        user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
            'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36',
            # Add more user-agents here
        ]

        headers = {
            'User-Agent': random.choice(user_agents),
        }
        r = requests.get(url, headers=headers)
    except:
        print('Page not found')
    
    soup = BeautifulSoup(r.content, 'html.parser')

    # Find the lyrics
    try:
        div = soup.find('div', attrs={'class':'ringtone'})
        print(soup)
        if soup.find('span', attrs={'class':'feat'}):
            lyrics = list(div.next_siblings)[9].text
        else:
            lyrics = list(div.next_siblings)[6].text
        
        # Get the name and author of the song  
        heading = soup.title.text
        author = heading.split('-')[0].strip()
        title = heading.split('-')[1].split(' ')[1].strip()
    except Exception as e:
        print(e)
        return 'Error getting lyrics'

    # Return to app.py
    lyrics = lyrics.replace('\n', '<br>')
    return re.sub(r'<br\s*/?>', '', lyrics, 1)

def getSongs():
    return db.execute('SELECT * FROM songs;')

def addSong(videoId, title, author):
    lyrics = getLyrics(title, author)
    try:
        db.execute('INSERT INTO songs (video_id, title, author, lyrics) VALUES (?, ?, ?, ?);', videoId, title, author, lyrics)
    except ValueError:
        pass #print('Song already in db, continuing')
        
def addSongsFromFile():
    with open('songList.csv') as file:
        for line in file:
            line = line.split(',')
            if(len(line) == 3):
                addSong(line[0], line[1], line[2].replace('\n', ''))
            
addSongsFromFile()
        
'''
while True:
    title = input('Title >> ')
    author = input('Author >> ')
    addSong('', title, author)'''