import React from 'react';
import GameCard from '../components/gameCard';
import CardHeader from '@material-ui/core/CardHeader';
import { Button, Card, CardActions, CardContent, CardMedia, IconButton, Menu, MenuItem } from '@material-ui/core'
import DialogContentText from '@material-ui/core/DialogContentText';
import bg from '../bg.jpeg'
import store from '../redux/store';
import { Provider } from 'react-redux';
import { describe, expect } from '@jest/globals';
import { mount } from 'enzyme';

describe('GameCard component test', () => {
  it('includes essential card subcomponents', () => {
    const wrapper = mount(
      <Provider store={store}>
        <GameCard id={123456} title={'dummy string'} createAt={'dummy string'} img={'dummy string'} setEdit={jest.fn()} />
      </Provider>
    );
    // console.log('DEBUGGGGG:', wrapper.find(Card).debug());
    expect(wrapper.find(Card).exists()).toBeTruthy();
    expect(wrapper.find(CardHeader).exists()).toBeTruthy();
    expect(wrapper.find(CardMedia).exists()).toBeTruthy();
    expect(wrapper.find(CardContent).exists()).toBeTruthy();
    expect(wrapper.find(CardActions).exists()).toBeTruthy();
    expect(wrapper.find(Button).exists()).toBeTruthy();
    expect(wrapper.find(IconButton).exists()).toBeTruthy();
    expect(wrapper.find(Menu).exists()).toBeTruthy();
  });

  it('includes all the essential menu options', () => {
    const wrapper = mount(
      <Provider store={store}>
        <GameCard id={123456} title={'dummy string'} createAt={'dummy string'} img={'dummy string'} setEdit={jest.fn()} />
      </Provider>
    );
    wrapper.find(Menu).simulate('click');
    expect(wrapper.find(MenuItem).first().text()).toEqual('Edit Game');
    expect(wrapper.find(MenuItem).at(1).text()).toEqual('Edit Game Question');
    expect(wrapper.find(MenuItem).at(2).text()).toEqual('Delete');
  });

  it('props properties are used correctly', () => {
    const id = 123456; // id must be displayed in card content
    const title = 'dummy string'; // title must be displayed in card header
    const createAt = 'dummy string'; // createAt must be displayed in card header
    const img = 'dummy string'; // img must be displayed in card media
    const wrapper = mount(
      <Provider store={store}>
        <GameCard id={id} title={title} createAt={createAt} img={img} setEdit={jest.fn()} />
      </Provider>
    );
    const createdDate = new Date(createAt).toString();
    expect(wrapper.find(CardHeader).prop('title')).toBe(title);
    expect(wrapper.find(CardHeader).prop('subheader')).toBe(createdDate);
    expect(wrapper.find(CardContent).text()).toEqual(expect.stringContaining(String(id)));
    expect(wrapper.find(CardMedia).prop('image')).toBe(img);
  });

  it('default image is used if game image is not provided(null)', () => {
    const wrapper = mount(
      <Provider store={store}>
        <GameCard id={123456} title={'dummy string'} createAt={'dummy string'} img={null} setEdit={jest.fn()} />
      </Provider>
    );
    expect(wrapper.find(CardMedia).prop('image')).toBe(bg);
  });

  it('calls function correctly in menuItem', () => {
    const wrapper = mount(
      <Provider store={store}>
        <GameCard id={123456} title={'dummy string'} createAt={'dummy string'} img={null} setEdit={jest.fn()} />
      </Provider>
    );
    const f1 = jest.fn();
    wrapper.setProps({
      children: <MenuItem onClick={f1}></MenuItem>
    });
    wrapper.find(MenuItem).first().simulate('click');
    expect(f1).toHaveBeenCalledTimes(1);
  });

  it('shows edit game instruction when edit game button pressed', () => {
    const wrapper = mount(
      <Provider store={store}>
        <GameCard id={123456} title={'dummy string'} createAt={'dummy string'} img={null} setEdit={jest.fn()} />
      </Provider>
    );
    wrapper.find(MenuItem).first().simulate('click');
    expect(wrapper.containsAllMatchingElements([
      <DialogContentText>
        To edit game tile or Upload a new cover image for current game.
      </DialogContentText>
    ])).toBeTruthy();
  });
});
