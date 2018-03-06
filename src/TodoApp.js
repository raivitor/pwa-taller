import React from 'react';
import axios from 'axios';
import './App.css';

const Title = ({ todoCount }) => {
  return (
    <div>
      <h1 className="title">To-do ({todoCount})</h1>
    </div>
  );
}

const TodoForm = ({ addTodo }) => {
  let input;
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      addTodo(input.value);
      input.value = '';
    }}>
      <input className="form-control col-md-12" ref={node => { input = node }} />
      <br />
    </form>
  );
};

const Todo = ({ todo, remove }) => {
  return (<a role="button" className="list-group-item" onClick={() => { remove(todo.id) }}>{todo.text}</a>);
}

const TodoList = ({ todos, remove }) => {
  const todoNode = todos.map((todo) => {
    return (<Todo todo={todo} key={todo.id} remove={remove} />)
  });
  return (<div className="list-group" style={{ marginTop: '30px' }}>{todoNode}</div>);
}


window.id = 0;
export default class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.apiUrl = 'http://5a9dd5a1a65e7d0014436b95.mockapi.io/note'
  }

  componentDidMount() {
    axios.get(this.apiUrl)
      .then((res) => {
        this.setState({ data: res.data });
      });
  }

  addTodo(val) {
    const todo = { text: val }

    axios.post(this.apiUrl, todo)
      .then((res) => {
        this.state.data.push(res.data);
        this.setState({ data: this.state.data });
      });
  }

  removeTodo(id) {
    const remainder = this.state.data.filter((todo) => {
      if (todo.id !== id) return todo;
    });

    axios.delete(this.apiUrl + '/' + id)
      .then((res) => {
        console.log(res)
        this.setState({ data: remainder });
      })
  }

  render() {
    return (
      <div className="principalBox">
        <Title todoCount={this.state.data.length} />
        <TodoForm addTodo={this.addTodo.bind(this)} />
        <TodoList
          todos={this.state.data}
          remove={this.removeTodo.bind(this)}
        />
      </div>
    );
  }
}