import React from 'react';
import CustomizedSnackbars from '../components/alert';
import { describe, expect } from '@jest/globals';
import { mount } from 'enzyme';
import MuiAlert from '@material-ui/lab/Alert';
import store from '../redux/store';
import { Provider } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';

describe('CustomizedSnackbars component test', () => {
  it('essential snackbar subcomponents are included', () => {
    const type = 'error'; // set the serverity of MuiAlert
    const message = 'dummy string'; // message to display
    const wrapper = mount(
      <Provider store={store}>
        <CustomizedSnackbars type={type} message={message} />
      </Provider>
    );
    expect(wrapper.find(Snackbar).exists()).toBeTruthy();
    expect(wrapper.find(MuiAlert).exists()).toBeTruthy();
  });

  it('Props properties are used correctly by MuiAlert', () => {
    const type = 'error'; // set the serverity of MuiAlert
    const message = 'dummy string'; // message to display
    const wrapper = mount(
      <Provider store={store}>
        <CustomizedSnackbars type={type} message={message} />
      </Provider>
    );
    expect(wrapper.find(MuiAlert).text()).toBe(message);
    expect(wrapper.find(MuiAlert).prop('severity')).toEqual(type);
    expect(wrapper).toMatchSnapshot();
  });
});
