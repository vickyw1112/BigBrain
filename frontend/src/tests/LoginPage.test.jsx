import React from "react";
import store from '../redux/store';
import LoginPage from '../pages/login';
import { mount } from 'enzyme';
import { describe, expect } from '@jest/globals';
import { Provider } from "react-redux";
import { Button, TextField } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';

describe('LoginPage test', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <Router>
        <Provider store={store}>
          <LoginPage />
        </Provider>
      </Router>
    );
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('includes login header', () => {
    expect(wrapper.containsAllMatchingElements([
      <h2>Log In</h2>
    ])).toBeTruthy();
  });

  it('has textfields for user to input login details', () => {
    //text field for email is included
    expect(wrapper.find(TextField).first().prop('placeholder')).toBe('Enter email address');
    expect(wrapper.find(TextField).first().prop('label')).toBe('Email address');
    expect(wrapper.find(TextField).first().prop('type')).toBe('email');
    //text field for password is included
    expect(wrapper.find(TextField).at(1).prop('placeholder')).toBe('Enter password');
    expect(wrapper.find(TextField).at(1).prop('label')).toBe('Password');
    expect(wrapper.find(TextField).at(1).prop('type')).toBe('password');

  });

  it('has login button', () => {
    expect(wrapper.find(Button).exists()).toBeTruthy();
    expect(wrapper.find(Button).text()).toBe("Log in");
    expect(wrapper.find(Button)).toMatchSnapshot();
  });
});
