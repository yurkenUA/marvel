import React, { Component } from 'react/cjs/react.production.min';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
  state = {
    chars: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 210,
    charEnded: false,
  };

  marvelService = new MarvelService();
  myRef = [];

  componentDidMount() {
    this.onRequest();

    window.addEventListener('scroll', this.handlerScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handlerScroll);
  }

  handlerScroll = () => {
    if (this.state.offset < 219) return;
    if (this.state.newItemLoading) return;
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      this.onRequest(this.state.offset);
      if (this.state.charEnded) {
        window.removeEventListener('scroll', this.handleScroll);
        console.log('unmount');
      }
    }
  };

  onRequest = (offset) => {
    this.onAllCharsLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onAllCharsLoaded)
      .catch(this.onError);
  };

  onAllCharsLoading = () => {
    this.setState({
      newItemLoading: true,
    });
  };

  onAllCharsLoaded = (newChars) => {
    // const ended = newChars.length < 9 ? true : false;
    const ended = this.marvelService._totalCharacters - this.state.offset <= 9;

    this.setState(({ chars, offset }) => ({
      chars: [...chars, ...newChars],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  setupRef = (elem) => {
    this.myRef.push(elem);
  };

  setCharActive = (e) => {
    this.myRef.forEach((elem) => elem.classList.remove('char__item_selected'));
    e.currentTarget.classList.add('char__item_selected');
    e.currentTarget.focus();
  };

  renderItems(arr) {
    const items = arr.map(({ id, name, thumbnail }) => {
      return (
        <li
          className="char__item"
          tabIndex={0}
          ref={this.setupRef}
          key={id}
          onClick={(e) => {
            this.props.onCharSelected(id);
            this.setCharActive(e);
          }}
        >
          <img
            src={thumbnail}
            alt={name}
            className={
              thumbnail.slice(-23) === 'image_not_available.jpg'
                ? 'char__item__img_not_found'
                : 'char__item__img'
            }
          />
          <div className="char__name">{name}</div>
        </li>
      );
    });
    return <ul className="char__grid">{items}</ul>;
  }

  render() {
    const { chars, loading, error, newItemLoading, offset, charEnded } =
      this.state;
    const items = this.renderItems(chars);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    return (
      <div className="char__list">
        {spinner} {errorMessage} {content}
        <button
          className="button button__main button__long"
          onClick={() => this.onRequest(offset)}
          disabled={newItemLoading}
          style={{ display: charEnded ? 'none' : 'block' }}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
