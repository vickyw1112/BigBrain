import React from 'react';
import { describe, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import NavBar from '../components/navbar';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { List } from '@material-ui/core';
import { mount } from 'enzyme';

describe('NavBar component test', () => {
  it('includes the App name', () => {
    render(
      <Provider store={store}>
        <NavBar />
      </Provider>
    );
    const appName = screen.getByText(/BigBrain/i);
    expect(appName).toBeInTheDocument();
  });
  /*
    it('has list item', () => {
      const wrapper = mount(
        <Provider store={store}>
          <NavBar />
        </Provider>
      );
      console.log('navbar', wrapper.debug());
      expect(wrapper.find(List).exists()).toBeTruthy();
    });
    */
});