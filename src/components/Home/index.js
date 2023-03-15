import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'
import Header from '../Header'
import ProjectItem from '../ProjectItem'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  progress: 'PROGRESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    projectsList: [],
    selectedValue: categoriesList[0].id,
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getProjectList()
  }

  getProjectList = async () => {
    this.setState({apiStatus: apiConstants.progress})
    const {selectedValue} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${selectedValue}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onChangeProject = event => {
    this.setState(
      {selectedValue: event.target.value.toUpperCase()},
      this.getProjectList,
    )
  }

  onRetry = () => {
    this.getProjectList()
  }

  renderProjectView = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-list-container">
        {projectsList.map(each => (
          <ProjectItem key={each.id} projectDetails={each} />
        ))}
      </ul>
    )
  }

  renderLoaderView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="TailSpin" color="#007BFF" width="25px" height="25px" />
    </div>
  )

  renderFailureView = () => (
    <div className="loader-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-msg">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="retry-button" type="button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderProjectView()
      case apiConstants.failure:
        return this.renderFailureView()
      default:
        return this.renderLoaderView()
    }
  }

  render() {
    const {selectedValue} = this.state
    return (
      <>
        <Header />
        <div className="home-container">
          <select
            htmlFor="project"
            className="select-container"
            onChange={this.onChangeProject}
            value={selectedValue}
          >
            {categoriesList.map(each => (
              <option
                id="project"
                key={each.id}
                value={each.id}
                className="option"
              >
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderSuccessView()}
        </div>
      </>
    )
  }
}

export default Home
