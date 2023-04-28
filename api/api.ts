import axios from 'axios'
import type {OrgRoam, OrgRoamLink, OrgRoamNode, Highlight} from '../models/models'


class ReviewApi {
	baseUrl : string;

	constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

	reviews(): Promise<Review[]>{
		return axios.get(`${this.baseUrl}/reviews`)
			.then((response) => {
				return response.data
		})
	}

	views(): Promise<any>{
		return axios.get(`${this.baseUrl}/views`)
			.then((response) => {
				return response.data
		})
	}

	reviewsForNode(node: string): Promise<Review[]>{
		return axios.get(`${this.baseUrl}/filter?node=${node}`)
			.then((response) => {
				return response.data
		})
	}

	insertReview(review: Review): Promise<void>{
		return axios.post(`${this.baseUrl}/reviews`, review).then((response) => {
				return response.data
		})
	}

}

class OrgRoamApi {
	baseUrl : string;

	constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

	orgroam() : Promise<OrgRoam> {
		return axios.get(`${this.baseUrl}`)
			.then((response) => {
				let ghostNodes = response.data.ghost.map((id: string) => ({ id: id }))
				Array.prototype.push.apply(response.data.nodes, ghostNodes)
				return response.data
		})
	}

	nodes() : Promise<Node[]> {
		return axios.get(`${this.baseUrl}/nodes`)
			.then((response) => {
				return response.data
		})
	}


	nodeWithId(id: string) : Promise<Node> {
		return axios.get(`${this.baseUrl}/nodes/${id}`)
			.then((response) => {
				return response.data
		})
	}

	tags() : Promise<string[]> {
		return axios.get(`${this.baseUrl}/tags`)
			.then((response) => {
				return response.data
		})
	}

	expr(query: string): Promise<OrgRoam> {
		return axios
			.get(`${this.baseUrl}/expr`, {
				params: {'q' : query}
			}).then((response) => {
				return response.data
			})
	}

	nodesWithTag(tag: string): Promise<Node[]> {
    return axios.get(`${this.baseUrl}/nodes?tag=${tag}`)
			.then(response => {
					return response.data
			})
	}

	links(id: string): Promise<Link[]> {
    return axios.get(`${this.baseUrl}/links?id=${id}`)
			.then(response => {
					return response.data
			})
	}

	read(id: string): Promise<string> {
    return axios
      .get(`${this.baseUrl}/read/${id}`)
  		.then((response) => {
				return response.data
			})
	}
}

//export const orgroamApi = new OrgRoamApi('/orgroam')
export const orgroamApi = new OrgRoamApi('https://devenv.dhaval.cloud/orgroam')
export const reviewApi = new ReviewApi('/review')
export const extraApi = new ReviewApi('/extras')
