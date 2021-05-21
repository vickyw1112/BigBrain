import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
// import MailIcon from '@material-ui/icons/Mail';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { logoutSuccess } from '../redux/actions'
import API_URL from '../constants';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
}));

const NavBar = () => {
  const isLogged = useSelector(state => state.isLogged);
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
  });
  const dispatch = useDispatch();
  const history = useHistory();
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  }
  const handleLogout = (e) => {
    fetch(`${API_URL}/admin/auth/logout`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('invalid email/password');
        }
      })
      .then(data => {
        dispatch(logoutSuccess());
        history.push('/login');
      })
      .catch(e => {
        console.log(e)
      })
  }

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
    >
      <List>
        <ListItem button key={'Dahsboard'} onClick={() => { history.push('/dashboard') }}>
          <ListItemIcon> <InboxIcon /> </ListItemIcon>
          <ListItemText primary={'Dashboard'} />
        </ListItem>

        <ListItem button key={'Log out'} onClick={handleLogout} data-test-target='NavBarLogoutButton'>
          <ListItemIcon> <ExitToAppIcon /> </ListItemIcon>
          <ListItemText primary={'Log out'} />
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {(isLogged.loggedIn &&
            <div>
              {['left'].map((anchor) => (
                <React.Fragment key={anchor}>
                  <IconButton edge="start" data-test-target='NavBarMenuButton' onClick={toggleDrawer(anchor, true)} className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                  </IconButton>
                  <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                    {list(anchor)}
                  </Drawer>
                </React.Fragment>
              ))}
            </div>
          )}
          <Typography variant="h6" className={classes.title}>
            BigBrain
        </Typography>
        </Toolbar>
      </AppBar>
    </div >
  );
}
export default NavBar;
