// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../../core/lib', 'react-bootstrap'], function (require, exports, React, jx, rb) {
    "use strict";
    var b = rb;
    var EmpsInvitExplorer = (function (_super) {
        __extends(EmpsInvitExplorer, _super);
        function EmpsInvitExplorer(props) {
            _super.call(this, props);
            this.state.emails = [];
        }
        EmpsInvitExplorer.prototype.render = function () {
            var ui = this.get_uiSchema();
            var send_enabled = this.state.emails.length > 0 ? 'success' : 'default';
            var html = React.createElement("div", null, React.createElement("div", {className: "alert alert-info"}, React.createElement("h3", {className: "m-l-xs"}, "You can add employees by sending invitation mails"), React.createElement("p", null, "You may import your contacts from Outlook, Gmail or Linkedin")), React.createElement(b.Button, {bsStyle: "primary", onClick: this.add_email.bind(this), className: "btn-outline"}, React.createElement("i", {className: "fa fa-plus"}), " Add email address"), React.createElement(b.Button, {bsStyle: send_enabled, className: "pull-right", onClick: this.send_invites.bind(this)}, React.createElement("i", {className: "fa fa-envelope-o"}), " Invite"), React.createElement("hr", null), React.createElement("form", null, React.createElement("div", {className: "email-list"}, _.map(this.state.emails, function (e) {
                return e.email;
            }))));
            return html;
        };
        EmpsInvitExplorer.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                    }
                    break;
                case 'delete-mail':
                    {
                        this.delete_mail(this.current_event.data);
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        EmpsInvitExplorer.prototype.get_uiSchema = function () {
            var ui = _super.prototype.get_uiSchema.call(this);
            return ui;
        };
        EmpsInvitExplorer.prototype.send_invites = function () {
            if (this.state.emails.length === 0) {
                return;
            }
            if (!this.root.find('form').valid()) {
                return;
            }
        };
        EmpsInvitExplorer.prototype.add_email = function () {
            var _this = this;
            var list = this.state.emails.slice();
            var max = _.max(_.map(this.state.emails, function (m) { return m.index; })) + 1;
            if (this.state.emails.length === 0) {
                max = 1;
            }
            list.push({
                index: max,
                email: React.createElement(EmailAddress, {owner: this, index: max})
            });
            this.newState({
                emails: list
            }, function () {
                _this.validate_mails();
            });
        };
        EmpsInvitExplorer.prototype.delete_mail = function (index) {
            var _this = this;
            var list = this.state.emails.slice();
            list.splice(index, 1);
            this.newState({
                emails: list
            }, function () {
                _this.validate_mails();
            });
        };
        EmpsInvitExplorer.prototype.validate_mails = function () {
            var options = {
                rules: {},
                errorPlacement: function (err, el) {
                    $(el).closest('.root').find('.error-place').empty();
                    $(el).closest('.root').find('.error-place').append(err);
                }
            };
            _.each(this.state.emails, function (m) {
                options.rules['email-{0}'.format(m.index)] = {
                    required: true,
                    email: true
                };
            });
            this.root.find('form').validate(options);
        };
        return EmpsInvitExplorer;
    }(jx.views.ReactiveView));
    exports.EmpsInvitExplorer = EmpsInvitExplorer;
    var EmailAddress = (function (_super) {
        __extends(EmailAddress, _super);
        function EmailAddress() {
            _super.apply(this, arguments);
        }
        EmailAddress.prototype.render = function () {
            var ui = this.get_uiSchema();
            var html = React.createElement("div", {className: "emp-email-add root"}, React.createElement("div", {className: "input-group m-b"}, React.createElement("span", {className: "input-group-btn"}, React.createElement("button", {type: "button", className: "btn btn-default"}, React.createElement("i", {className: "fa fa-envelope-o"}))), React.createElement("input", {type: "email", className: "form-control", required: true, placeholder: "Enter a valid email address", name: "email-{0}".format(this.props.index)}), React.createElement("span", {className: "input-group-btn"}, React.createElement("button", {type: "button", className: "btn btn-default", onClick: this.delete_email.bind(this)}, React.createElement("i", {className: "fa fa-times"})))), React.createElement("span", {className: "error-place"}));
            return html;
        };
        EmailAddress.prototype.delete_email = function () {
            this.props.owner.notify({
                action: 'delete-mail',
                data: this.props.index
            });
        };
        return EmailAddress;
    }(jx.views.ReactiveView));
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/views/emps/emps_invit.js.map