import React, { Component, PropTypes, createElement } from 'react';
import { withTheme } from 'styled-components';
import getMonitor from '../utils/getMonitor';

class DevTools extends Component {
  constructor(props) {
    super(props);
    this.getMonitor(props);
  }

  getMonitor(props) {
    const monitorElement = getMonitor(props);
    this.monitorProps = monitorElement.props;
    this.Monitor = monitorElement.type;

    const update = this.Monitor.update;
    if (update) {
      let newMonitorState;
      const monitorState = props.monitorState;
      if (monitorState && monitorState.__overwritten__ === props.monitor) {
        newMonitorState = monitorState;
      } else {
        newMonitorState = update(this.monitorProps, undefined, {});
        if (newMonitorState !== monitorState) {
          this.preventRender = true;
        }
      }
      this.dispatch({
        type: '@@INIT_MONITOR',
        newMonitorState,
        update,
        monitorProps: this.monitorProps
      });
    }
  }

  componentWillUpdate(nextProps) {
    if (
      nextProps.monitor !== this.props.monitor ||
      nextProps.options !== this.props.options
    ) this.getMonitor(nextProps);
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.monitor !== this.props.monitor ||
      nextProps.liftedState !== this.props.liftedState ||
      nextProps.monitorState !== this.props.liftedState ||
      nextProps.options !== this.props.options ||
      nextProps.theme.scheme !== this.props.theme.scheme
    );
  }

  dispatch = action => {
    this.props.dispatch(action);
  };

  render() {
    if (this.preventRender) {
      this.preventRender = false;
      return null;
    }

    const liftedState = {
      ...this.props.liftedState,
      monitorState: this.props.monitorState
    };
    return (
      <div className={`monitor monitor-${this.props.monitor}`}>
        <this.Monitor
          {...liftedState}
          {...this.monitorProps}
          dispatch={this.dispatch}
          theme={this.props.theme}
        />
      </div>
    );
  }
}

DevTools.propTypes = {
  liftedState: PropTypes.object,
  monitorState: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  monitor: PropTypes.string,
  options: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme(DevTools);
