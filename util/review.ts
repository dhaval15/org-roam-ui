//import type { Review, TextSelection } from '../models/models'

export function insertReview(content: string, review: Review) : string {
		return `${content.substring(0, review.start)}[[review:${review.id}][${review.content}]]${content.substring(review.end + 1)}`
}

export function findSelections(content: string, text: string) : TextSelection[] {
	let regex = RegExp(text.trim().split(RegExp('\\s+')).join('\\s+'), 'g')
	let matches = content.matchAll(regex)
	return Array.from(matches).map((e) => {
		return {
			start: e.index,
			end: e.index + e['0'].length - 1,
			content: e[0],
		}
	})
}

export function highlightSelections(content: string, selections: TextSelection[]) : string[] {
	let extra = 50
	let contentLength = content.length
	return selections.map((selection) => {
		let enclosingStart = selection.start - extra > 0 ? selection.start - extra : 0
		let enclosingEnd = selection.end + extra < contentLength - 1 ? selection.end + extra :  contentLength - 1
		let newStart = selection.start - enclosingStart
		let newEnd = enclosingEnd - selection.end
		return `${content.substring(enclosingStart, newStart)} <b> ${content.substring(newStart, newEnd + 1)} </b> ${content.substring(newEnd + 1, enclosingEnd)} `
	})
}
