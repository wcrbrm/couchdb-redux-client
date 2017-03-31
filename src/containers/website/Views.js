import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchOne } from '../../engine/ApiData';

class WebsiteViews extends Component {

  componentDidMount() {
    this.props.load();
  }

  render() {
    if (!this.props.views) return false;
    return (
      <div>
        <h1>Website Views</h1>
        {this.props.views.map((v, index) => {
          const indexKey = index;
          return (
            <div key={indexKey}>
              <h3 style={{ padding: '0px' }}>
                <span style={{ fontSize: '12px' }}>{v.scope}</span> &nbsp;
                {v.id}
              </h3>
              <pre>{v.map}</pre>
            </div>
          );
        })}
      </div>
    );
  }
}

export default connect(
  state => ({
    views: state.dbConfig.views
  }),
  dispatch => ({
    load: () => {
      fetchOne('dbconfig/views', (data) => {
        dispatch({ type: 'saveDbConfig', payload: ['views', data] });
      });
    }
  })
)(WebsiteViews);
