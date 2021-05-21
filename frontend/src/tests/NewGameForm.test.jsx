import React from 'react';
import NewGameForm from '../components/newGameForm'
import { describe, expect } from '@jest/globals';
import store from '../redux/store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { DialogTitle, DialogContent, TextField, DialogActions, DialogContentText } from '@material-ui/core';
import Button from '@material-ui/core/Button';

describe('NewGameForm component test', () => {
    it('shows essential subcomponents when opened', () => {
        const closeHandler = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <NewGameForm open={true} handleClose={closeHandler} />
            </Provider>
        );
        expect(wrapper.find(DialogTitle).exists()).toBeTruthy();
        expect(wrapper.find(DialogContent).exists()).toBeTruthy();
        expect(wrapper.find(DialogContentText).exists()).toBeTruthy();
        expect(wrapper.find(DialogActions).exists()).toBeTruthy();
        expect(wrapper.find(TextField).exists()).toBeTruthy();
        expect(wrapper.find(Button).exists()).toBeTruthy();
    });

    it('hides essential subcomponents when closed', () => {
        const closeHandler = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <NewGameForm open={false} handleClose={closeHandler} />
            </Provider>
        );
        expect(wrapper.find(DialogTitle).exists()).toBeFalsy();
        expect(wrapper.find(DialogContent).exists()).toBeFalsy();
        expect(wrapper.find(DialogContentText).exists()).toBeFalsy();
        expect(wrapper.find(DialogActions).exists()).toBeFalsy();
        expect(wrapper.find(TextField).exists()).toBeFalsy();
        expect(wrapper.find(Button).exists()).toBeFalsy();
    });

    it('displays make new game instruction', () => {
        const closeHandler = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <NewGameForm open={true} handleClose={closeHandler} />
            </Provider>
        );
        expect(wrapper.find(DialogTitle).text()).toBe('Add a new game');
        expect(wrapper.find(DialogContentText).text()).toBe('To add a new game, please enter the game name.');
        expect(wrapper.find(Button).first().text()).toBe('Cancel');
        expect(wrapper.find(Button).at(1).text()).toBe('Add');
    });

    it('sets up text field correctly', () => {
        const closeHandler = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <NewGameForm open={true} handleClose={closeHandler} />
            </Provider>
        );
        expect(wrapper.find(TextField).prop('id')).toBe('name');
        expect(wrapper.find(TextField).prop('label')).toBe('Game name');
        expect(wrapper.find(TextField).prop('type')).toBe('text');
        expect(wrapper.find(TextField).prop('margin')).toBe('dense');
    });

    it('button handles click event correctly', () => {
        const closeHandler = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <NewGameForm open={true} handleClose={closeHandler} />
            </Provider>
        );
        wrapper.find(Button).first().simulate('click');
        expect(closeHandler).toHaveBeenCalledTimes(1);
    });

});