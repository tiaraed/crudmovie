import { StatusBar, } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, SafeAreaView, Platform, Image } from 'react-native';
import { Surface, Title, TextInput } from 'react-native-paper';
import ModalView from './src/components/ModalView';
import PostCardItem from './src/components/PostCardItem';

const url = 'http://4066-182-0-134-240.ngrok.io/posts'

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export default function App() {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [plot, setPlot] = useState('');
  const [genre, setGenre] = useState('');
  const [releasedate, setReleasedate] = useState('');
  const [postId, setPostId] = useState(0);
  const [loading, setLoading] = useState(false);

  const getPosts = async () => {
    setLoading(true)
    await fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      })
      .catch(e => console.log(e))
    setLoading(false)
  }

  const addPost = (title, plot) => {
    fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        "plot": plot,
        "title": title,
        "genre": genre,
        "releasedate": releasedate,
      })
    }).then((res) => res.json())
      .then(resJson => {
        console.log('post:', resJson)
        updatePost()
      }).catch(e => { console.log(e) })
  }

  const editPost = (postId, title, plot) => {
    fetch(url + `/${postId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        "plot": plot,
        "title": title,
        "genre": genre,
        "releasedate": releasedate,
      })
    }).then((res) => res.json())
      .then(resJson => {
        console.log('updated:', resJson)
        updatePost()
      }).catch(e => { console.log(e) })
  }

  const deletePost = (postId) => {
    fetch(url + `/${postId}`, {
      method: "DELETE",
      headers,
    }).then((res) => res.json())
      .then(resJson => {
        console.log('delete:', resJson)
        getPosts()
      }).catch(e => { console.log(e) })
  }

  const updatePost = () => {
    getPosts()
    setVisible(false);
    setPlot('')
    setTitle('')
    setGenre('')
    setReleasedate('')
    setPostId(0)
  }

  const edit = (id, title, plot, genre, releasedate) => {
    setVisible(true)
    setPostId(id)
    setTitle(title)
    setPlot(plot)
    setGenre(genre)
    setReleasedate(releasedate)
  }

  useEffect(() => {
    getPosts();
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Surface style={styles.header}>
        <Title>TEAM 2 - Movie App</Title>
        <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
          <Text style={styles.buttonText}>Add Movie</Text>
        </TouchableOpacity>
      </Surface>

      <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <Image source={require('../dbMovieApp/assets/bioskop.jpeg')} />
      <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 40, fontWeight: 'bold', color: 'white'}}>SELAMAT DATANG !</Text>
      </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id + index.toString()}
        refreshing={loading}
        onRefresh={getPosts}
        renderItem={({ item }) => (
          <PostCardItem
            poster={item.poster}
            title={item.title}
            plot={item.plot}
            genre={item.genre}
            releasedate={item.releasedate}
            onEdit={() => edit(item.id, item.title, item.plot, item.genre, item.releasedate)}
            onDelete={() => deletePost(item.id)}
          />
        )}
      />
      <ModalView
        visible={visible}
        title="Add Movie"
        onDismiss={() => setVisible(false)}
        onSubmit={() => {
          if (postId && title && plot && genre && releasedate) {
            editPost(postId, title, plot, genre, releasedate)
          } else {
            addPost(title, plot, genre, releasedate)
          }
        }}
        cancelable
      >
        <TextInput
          label="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
          mode="outlined"
        />
        <TextInput
          label="Plot"
          value={plot}
          onChangeText={(text) => setPlot(text)}
          mode="outlined"
        />
        <TextInput
          label="Genre"
          value={genre}
          onChangeText={(text) => setGenre(text)}
          mode="outlined"
        />
        <TextInput
          label="Released Date"
          value={releasedate}
          onChangeText={(text) => setReleasedate(text)}
          mode="outlined"
        />
      </ModalView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0404',
    justifyContent: 'center',
  },
  header: {
    marginTop: Platform.OS === 'android' ? 24 : 0,
    padding: 16,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  button: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#D32F2F',
  },
  buttonText: {
    color: 'white'
  },
});
