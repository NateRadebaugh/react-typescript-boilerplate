/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Helmet from 'react-helmet';

import messages from './messages';
import { createStructuredSelector } from 'reselect';

import {
  selectRepos,
  selectLoading,
  selectError,
} from 'app/containers/App/selectors';

import {
  makeSelectUsername,
} from './selectors';

import { changeUsername } from './actions';
import { loadRepos } from '../App/actions';

import { FormattedMessage } from 'react-intl';
import RepoListItem from 'app/containers/RepoListItem';
import Button from 'app/components/Button';
import H2 from 'app/components/H2';
import List from 'app/components/List';
import ListItem from 'app/components/ListItem';
import LoadingIndicator from 'app/components/LoadingIndicator';
import ReposList from 'app/components/ReposList';

const styles = require('./styles.module.css');

interface IHomePageProps {
  changeRoute?: (route: string) => void;
  loading?: boolean;
  error?: Error | false;
  repos?: any[];
  onSubmitForm?: () => React.EventHandler<React.FormEvent<any>>;
  username?: string;
  onChangeUsername?: () => React.EventHandler<React.FormEvent<any>>;
}

export class HomePage extends React.Component<IHomePageProps, {}> {
  /**
   * when initial state username is not null, submit the form to load repos
   */
  private componentDidMount() {
    if (this.props.username && this.props.username.trim().length > 0) {
      this.props.onSubmitForm();
    }
  }

  /**
   * Changes the route
   *
   * @param  {string} route The route we want to go to
   */
  private openRoute = (route) => {
    this.props.changeRoute(route);
  }

  /**
   * Changed route to '/features'
   */
  private openFeaturesPage = () => {
    this.openRoute('/features');
  }

  public render() {
    const { loading, error, repos } = this.props;
    const reposListProps = {
      loading,
      error,
      repos,
    };
    const mainContent = (<ReposList {...reposListProps} />);

    return (
      <article>
        <Helmet>
          <title>Home Page</title>
          <meta name="description" content="A React.js Boilerplate application homepage" />
        </Helmet>
        <div>
          <section className={`${styles.textSection} ${styles.centered}`}>
            <H2>
              <FormattedMessage {...messages.startProjectHeader} />
            </H2>
            <p>
              <FormattedMessage {...messages.startProjectMessage} />
            </p>
          </section>
          <section className={styles.textSection}>
            <H2>
              <FormattedMessage {...messages.trymeHeader} />
            </H2>
            <form className={styles.usernameForm} onSubmit={this.props.onSubmitForm}>
              <label htmlFor="username">
                <FormattedMessage {...messages.trymeMessage} />
                <span className={styles.atPrefix}>
                  <FormattedMessage {...messages.trymeAtPrefix} />
                </span>
                <input
                  id="username"
                  className={styles.input}
                  type="text"
                  placeholder="mxstbr"
                  value={this.props.username}
                  onChange={this.props.onChangeUsername}
                />
              </label>
            </form>
            {mainContent}
          </section>
          <Button handleRoute={this.openFeaturesPage}>
            <FormattedMessage {...messages.featuresButton} />
          </Button>
        </div>
      </article>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    changeRoute: (url) => dispatch(push(url)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) { evt.preventDefault(); }
      dispatch(loadRepos());
    },

    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
  repos: selectRepos(),
  username: makeSelectUsername(),
  loading: selectLoading(),
  error: selectError(),
});

// Wrap the component to inject dispatch and state into it
export default connect<{}, {}, IHomePageProps>(mapStateToProps, mapDispatchToProps)(HomePage);
