var React = require('react'),
    Router = require('react-router'),
    {Link, Navigation} = Router,
    mui = require('material-ui'),
    Menu = mui.Menu;

var $ = require('jquery');


var Page = React.createClass({

  getDefaultProps: function() {
    return {
      wiki: {
        ViewPage: {loading: true}
      }
    };
  },

  /**
   * Magic goes here!
   */
  componentWillMount: function()
  {
    if(process.env.IS_BROWSER==true) {
      if(this.props.params.uid)
      {
        this.props.actions.findContextPage(0, this.props.params.uid);
      }
      else {
        this.props.actions.findContextPage(0, 'Index');
      }
    }
  },

  getViewPage:function() {
    // Did not use transmit here yet;
    return this.props.wiki.viewPage;
  },

  render: function()
  {
    const page = this.getViewPage();
    console.log('page:',page);
    if(page.loading == true) {
      var disabled=true;
    } else {
      var disabled=false;
    }

    return (
        <div className="wiki-wrapper">
          <div className="wiki-page">
            <div className="container-fluid">
              <div className="row">
                <h3>{page.pageUid} - edit</h3>

                <mui.TextField
                    ref="contentInput"
                  //hintText="Hint Text (MultiLine)"
                    defaultValue={page.content}
                    value={page.content}
                    name="content"
                    multiLine={true}
                    style={{width:"99%"}}
                    onChange={this.props.actions.setWikiViewPageField}
                />

                <mui.RaisedButton label="Save" primary={true}  disabled={disabled}  onClick={this.save}  />
              &nbsp;<mui.RaisedButton label="Cancel" primary={false}  disabled={disabled} onClick={this.cancelAndReturn} />
              &nbsp;<mui.RaisedButton label="Return" primary={false}  disabled={disabled} onClick={this.cancelAndReturn} />

              </div>
            </div>
          </div>
          <div className="footer">
            <Link to="wiki" params={{uid: 'Special:Index'}}>This Wiki Index</Link>
          </div>
        </div>
    );
  },

  cancelAndReturn: function() {

    const page = this.getViewPage();
    this.props.history.pushState(null, `/wiki/${page.pageUid}`);
  },

  save: function() {
    const page = this.getViewPage();
    var content = this.refs.contentInput.getValue();
    this.props.actions.saveWikiChanges(page.id, {
      content: content,
      contextEntityId:page.contextEntityId,
      pageUid:page.pageUid,
    });
  },

  componentWillReceiveProps: function(newProps,b,c)  {
    if(newProps.wiki.viewPage.pageUid !==  this.props.params.uid)
    {
      //Actions.findContextPage(0, this.getParams().uid);
    }
  },
});

module.exports = Page;
