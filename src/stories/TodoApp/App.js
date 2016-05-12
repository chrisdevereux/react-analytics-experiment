import React from 'react'
import {v4 as uuid} from 'uuid'
import ReactCSSTransition from 'react-addons-css-transition-group'

import Track from '../../react-analytics'
import './theme.css'

export default class App extends React.Component {
  componentWillMount() {
    this.setState({
      todos: [newTask(1)],
      createdCount: 1
    });
    
    this.handleRequestAdd = this.handleRequestAdd.bind(this);
    this.handleRequestDelete = this.handleRequestDelete.bind(this);
    this.handleRequestTitleChange = this.handleRequestTitleChange.bind(this);
  }
  
  handleRequestDelete(id) {
    this.setState({
      todos: this.state.todos.filter(t => t.id !== id),
    });
  }
  
  handleRequestAdd() {
    this.setState({
      todos: [...this.state.todos, newTask(this.state.createdCount + 1)],
      createdCount: this.state.createdCount + 1
    });
  }
  
  handleRequestTitleChange(taskID, title) {
    const index = this.state.todos.findIndex(x => x.id === taskID);
    const todos = [...this.state.todos];
    
    todos[index].title = title;
    
    this.setState({todos});
  }
  
  render() {
    return (
      <Track.Scope type='todos' state={{createdCount: this.state.createdCount, visibleCount: this.state.todos.length}}>
        <div className='todos'>
          <div className='todos-list'>
            <ReactCSSTransition component='ul' transitionName='task-transition' transitionEnterTimeout={500} transitionLeaveTimeout={500}>
            {
              this.state.todos.map(t =>
                <Track.Scope key={t.id} type='task'>
                  <Track>
                    <Task
                      taskID={t.id}
                      title={t.title}
                      onDelete={this.handleRequestDelete}
                      onTitleChange={this.handleRequestTitleChange}
                    />
                  </Track>
                </Track.Scope>
              )
            }
            </ReactCSSTransition>
          </div>
          <Track>
            <button className='todos-btn-add' onClick={this.handleRequestAdd}>
              New Task
            </button>
          </Track>
        </div>
      </Track.Scope>
    );
  }
}

const Task = ({taskID, title, onDelete, onTitleChange}) => (
  <li className='task'>
    <button className='task-btn-delete' onClick={() => onDelete(taskID)}>
      ✗
    </button>
    <input className='task-title'
      value={title}
      onChange={evt =>
        onTitleChange(taskID, evt.target.value) 
      }
    />
  </li>
);


function newTask(i) {
  return {id: uuid(), title: 'Task #' + i};
}