import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';


Spotify.getAccessToken();

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName : 'Meine Playlist',
      playlistTracks : []
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.filterSearchResultsByPlaylist = this.filterSearchResultsByPlaylist.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      let newPlaylistTracks = this.state.playlistTracks.slice();
      newPlaylistTracks.push(track);
      this.setState({
        playlistTracks: newPlaylistTracks
      });
    }
  }

  removeTrack(track) {
    let newPlaylistTracks = this.state.playlistTracks.filter( playlistTrack => playlistTrack.id !== track.id);
    this.setState({
      playlistTracks: newPlaylistTracks
    });
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map( track => {
      return track.uri;
    });

    Spotify.savePlaylist(this.state.playlistName, trackURIs);

    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    });
  }

  search(searchTerm) {
    Spotify.search(searchTerm)
      .then(searchResults => {
        console.log('Spotify Response: ' + JSON.stringify(searchResults[0]));
        return searchResults})
      .then(searchResults => this.setState({
          searchResults: searchResults
        })
      );
  }

  // new method to filter the search results by tracks from the playlistTracks
  filterSearchResultsByPlaylist() {
    if (this.state.searchResults.length === 0) {
      return this.state.searchResults;
    } else {
        return this.state.searchResults.filter( track => {
          if ( this.state.playlistTracks.find( ptrack => {
                return ptrack.id === track.id;
              }))
          {
            return false;
          } else {
            return true;
          }
      });
    }
  }


  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.filterSearchResultsByPlaylist()}
                           onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistname}
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
