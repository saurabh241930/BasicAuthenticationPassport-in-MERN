import React from 'react';

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
      }
  }

  onNameChange = (event) => {
    this.setState({
      username: event.target.value
    })
  }

  onPasswordChange = (event) => {
    this.setState({
      password: event.target.value
    })
  }

  onSubmitSignIn = () => {
    fetch('http://localhost:3001/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: this.state.password,
          username: this.state.username
        })
      })
      .then(response => response.json())
      .then(user => {
        if (user) {
          this.props.loadUser(user)
          this.props.onRouteChange('home');
        }
      })
  }

  render() {
    return ( <
      article className = "br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center" >
      <
      main className = "pa4 black-80" >
      <
      div className = "measure" >
      <
      fieldset id = "sign_up"
      className = "ba b--transparent ph0 mh0" >
      <
      legend className = "f1 fw6 ph0 mh0" > Login < /legend> <
      div className = "mt3" >
      <
      label className = "db fw6 lh-copy f6"
      htmlFor = "name" > Name < /label> <
      input className = "pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
      type = "text"
      name = "username"
      id = "name"
      onChange = {
        this.onNameChange
      }
      /> </div>



      <div className = "mv3" >
      <label className = "db fw6 lh-copy f6"
      htmlFor = "password" > Password < /label> <
      input className = "b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
      type = "password"
      name = "password"
      id = "password"
      onChange = {
        this.onPasswordChange
      }
      /> < /
      div > <
      /fieldset> <
      div className = "" >
      <
      input onClick = {
        this.onSubmitSignIn
      }
      className = "b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
      type = "submit"
      value = "Login" /
      >
      <
      /div> < /
      div > <
      /main> < /
      article >
    );
  }
}

export default Signin;