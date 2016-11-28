// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');

import jx = require('../../core/lib');

export class InsPageSubNavBar extends jx.views.ReactView {


    render() {

        var html =
        <div className="row border-bottom">
        <nav style={{marginBottom: 0}} role="navigation" className="navbar navbar-static-top">
          <div className="navbar-header">
            <a href="#" className="navbar-minimalize minimalize-styl-2 btn btn-primary "><i className="fa fa-bars" /> </a>
            <form action="search_results.html" className="navbar-form-custom" role="search">
              <div className="form-group">
                <input type="text" id="top-search" name="top-search" className="form-control" placeholder="Search for something..." />
              </div>
            </form>
          </div>
          <ul className="nav navbar-top-links navbar-right">
            <li>
              <span className="m-r-sm text-muted welcome-message">Welcome to INSPINIA+ Admin Theme.</span>
            </li>
            <li className="dropdown">
              <a href="#" data-toggle="dropdown" className="dropdown-toggle count-info">
                <i className="fa fa-envelope" />  <span className="label label-warning">16</span>
              </a>
              <ul className="dropdown-menu dropdown-messages">
                <li>
                  <div className="dropdown-messages-box">
                    <a className="pull-left" href="profile.html">
                      <img src="/ins/img/a7.jpg" className="img-circle" alt="image" />
                    </a>
                    <div className="media-body">
                      <small className="pull-right">46h ago</small>
                      <strong>Mike Loreipsum</strong> started following <strong>Monica Smith</strong>. <br />
                      <small className="text-muted">3 days ago at 7:58 pm - 10.06.2014</small>
                    </div>
                  </div>
                </li>
                <li className="divider" />
                <li>
                  <div className="dropdown-messages-box">
                    <a className="pull-left" href="profile.html">
                      <img src="/ins/img/a4.jpg" className="img-circle" alt="image" />
                    </a>
                    <div className="media-body ">
                      <small className="pull-right text-navy">5h ago</small>
                      <strong>Chris Johnatan Overtunk</strong> started following <strong>Monica Smith</strong>. <br />
                      <small className="text-muted">Yesterday 1:21 pm - 11.06.2014</small>
                    </div>
                  </div>
                </li>
                <li className="divider" />
                <li>
                  <div className="dropdown-messages-box">
                    <a className="pull-left" href="profile.html">
                      <img src="/ins/img/profile.jpg" className="img-circle" alt="image" />
                    </a>
                    <div className="media-body ">
                      <small className="pull-right">23h ago</small>
                      <strong>Monica Smith</strong> love <strong>Kim Smith</strong>. <br />
                      <small className="text-muted">2 days ago at 2:30 am - 11.06.2014</small>
                    </div>
                  </div>
                </li>
                <li className="divider" />
                <li>
                  <div className="text-center link-block">
                    <a href="mailbox.html">
                      <i className="fa fa-envelope" /> <strong>Read All Messages</strong>
                    </a>
                  </div>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="#" data-toggle="dropdown" className="dropdown-toggle count-info">
                <i className="fa fa-bell" />  <span className="label label-primary">8</span>
              </a>
              <ul className="dropdown-menu dropdown-alerts">
                <li>
                  <a href="mailbox.html">
                    <div>
                      <i className="fa fa-envelope fa-fw" /> You have 16 messages
                      <span className="pull-right text-muted small">4 minutes ago</span>
                    </div>
                  </a>
                </li>
                <li className="divider" />
                <li>
                  <a href="profile.html">
                    <div>
                      <i className="fa fa-twitter fa-fw" /> 3 New Followers
                      <span className="pull-right text-muted small">12 minutes ago</span>
                    </div>
                  </a>
                </li>
                <li className="divider" />
                <li>
                  <a href="grid_options.html">
                    <div>
                      <i className="fa fa-upload fa-fw" /> Server Rebooted
                      <span className="pull-right text-muted small">4 minutes ago</span>
                    </div>
                  </a>
                </li>
                <li className="divider" />
                <li>
                  <div className="text-center link-block">
                    <a href="notifications.html">
                      <strong>See All Alerts</strong>
                      <i className="fa fa-angle-right" />
                    </a>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <a href="login.html">
                <i className="fa fa-sign-out" /> Log out
              </a>
            </li>
            <li>
              <a className="right-sidebar-toggle">
                <i className="fa fa-tasks" />
              </a>
            </li>
          </ul>
        </nav>
      </div>

        return html;
    }
}