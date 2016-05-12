import React from 'react';
import {v4 as uuid} from 'uuid';

const onAnalyticsEvent = 'react_analytics$onAnalyticsEvent';
const scopeStack = 'react_analytics$scopeStack';

// Injects event obsevers into an element
// Maybe could be a bit less 'magic' about this.
export default class Track extends React.Component {
  render() {
    const el = React.Children.only(this.props.children);
    
    // Treat all function properties with keys starting with 'on' as event handlers
    const eventHandlers = Object.keys(el.props)
      .filter(key => key.match(/^on/) && typeof el.props[key] === 'function')
    ;
    
    const swizzledEvents = {};
    eventHandlers.forEach(eventKey => {
      const handleEvent = el.props[eventKey];
      
      swizzledEvents[eventKey] = (...args) => {
        handleEvent(...args);
        
        if (!this.context[onAnalyticsEvent]) return;
        this.context[onAnalyticsEvent]({
          event: eventKey.substr(2),
          scopes: this.context[scopeStack]
        });
      };
    });
    
    return React.cloneElement(el, swizzledEvents);
  }
}

Track.contextTypes = {
  [onAnalyticsEvent]: React.PropTypes.func,
  [scopeStack]: React.PropTypes.array,
};


// Connect event observers to analytics API
Track.Root = class Track$Root extends React.Component {
  getChildContext() {
    return {
      [onAnalyticsEvent]: this.props.onAnalyticsEvent,
      [scopeStack]: []
    };
  }
  
  render() {
    return React.Children.only(this.props.children);
  }
}


Track.Root.childContextTypes = {
  [onAnalyticsEvent]: React.PropTypes.func,
  [scopeStack]: React.PropTypes.array,
};


// Provide scoped metadata about analytics events 
Track.Scope = class Track$Scope extends React.Component {
  componentWillMount() {
    this.mountTimestamp = Date();
    this.uuid = uuid();
  }
  
  getChildContext() {
    const prev = this.context && this.context[scopeStack] || [];
    
    return {
      [scopeStack]: [
        ...prev,
        Object.assign({
          type: this.props.type,
          instance: this.uuid,
          mountedTime: this.mountTimestamp,
        }, this.props.state || {})
      ]
    };
  }
  
  render() {
    return React.Children.only(this.props.children);
  }
}

Track.Scope.childContextTypes = {
  [scopeStack]: React.PropTypes.array,
};

Track.Scope.contextTypes = {
  [scopeStack]: React.PropTypes.array,
};
