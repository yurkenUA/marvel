import React, { Component } from 'react/cjs/react.production.min';

import AppHeader from '../appHeader/AppHeader';
import RandomChar from '../randomChar/RandomChar';
import CharList from '../charList/CharList';
import CharInfo from '../charInfo/CharInfo';
import ErrorBoundry from '../errorBoundry/ErrorBoundry';

import decoration from '../../resources/img/vision.png';

class App extends Component {
  state = {
    selectedChar: null,
  };

  onCharSelected = (id) => {
    this.setState({ selectedChar: id });
  };

  render() {
    return (
      <div className="app">
        <AppHeader />
        <main>
          <RandomChar />
          <div className="char__content">
            <CharList onCharSelected={this.onCharSelected} />
            <ErrorBoundry>
              <CharInfo charId={this.state.selectedChar} />
            </ErrorBoundry>
          </div>
          <img className="bg-decoration" src={decoration} alt="vision" />
        </main>
      </div>
    );
  }
}

export default App;
