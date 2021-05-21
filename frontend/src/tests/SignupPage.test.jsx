import React from "react";
import store from '../redux/store';
import SignupPage from '../pages/signup';
import { mount } from 'enzyme';
import { describe, expect } from '@jest/globals';
import { Provider } from "react-redux";
import { Button, TextField } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';

describe('SignupPage test', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <Router>
        <Provider store={store}>
          <SignupPage />
        </Provider>
      </Router>
    );
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('includes signup header', () => {
    expect(wrapper.containsAllMatchingElements([
      <h2>Sign up</h2>
    ])).toBeTruthy();
  });

  it('has textfields for user to input signup details', () => {
    // text field for email is included
    expect(wrapper.find(TextField).first().prop('placeholder')).toBe('Enter email address');
    expect(wrapper.find(TextField).first().prop('label')).toBe('Email address');
    expect(wrapper.find(TextField).first().prop('type')).toBe('email');
    // ext field for password is included
    expect(wrapper.find(TextField).at(1).prop('placeholder')).toBe('Enter password');
    expect(wrapper.find(TextField).at(1).prop('label')).toBe('Password');
    expect(wrapper.find(TextField).at(1).prop('type')).toBe('password');
    // text field for username is included
    expect(wrapper.find(TextField).at(2).prop('placeholder')).toBe('Enter name');
    expect(wrapper.find(TextField).at(2).prop('label')).toBe('Name');
    expect(wrapper.find(TextField).at(2).prop('type')).toBe('text');
  });

  it('has login button', () => {
    expect(wrapper.find(Button).exists()).toBeTruthy();
    expect(wrapper.find(Button).text()).toBe("Sign up");
    expect(wrapper.find(Button)).toMatchSnapshot();
  });
});
