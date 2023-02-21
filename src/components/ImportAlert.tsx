import { Alert } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../app-context'
import { useExtension } from '../extension-context'
import { MediaItem } from '../model'
import { assetsToItems } from '../model/conversion'
import _ from 'lodash'

/**
 * Alert that shows the user how many new, updated or out-of-sync images can be imported.
 * @returns ImportAlert component
 */
const ImportAlert = () => {
	const app = useContext(AppContext)
	const { params } = useExtension()

	const [updated, setUpdated] = useState(0)
	const [outOfSync, setOutOfSync] = useState(0)
	const [available, setAvailable] = useState(0)

	/**
	 * When app.entries/items change, this useEffect compares the items that have already been added
	 * to the gallery with items listed for import. There are three possible outcomes:
	 *
	 * updated: the item listed for import has been updated since the item was added to the gallery
	 * outOfSync: the item listed for import has new or different fields than the item previously added to the gallery
	 * available: the item listed for import has NOT been added to the gallery yet
	 *
	 */
	useEffect(() => {
		if (app.entries && app.items) {
			let updatedCount = 0
			let outOfSyncCount = 0
			let availableCount = 0

			assetsToItems(app.entries, params).forEach((item: MediaItem) => {
				const filtered = app.items.filter((item2: MediaItem) => item2.id === item.id)
				if (filtered.length > 0) {
					filtered.forEach((fItem: MediaItem) => {
						if (fItem.id === item.id) {
							if (fItem.dateModified < item.dateModified) {
								updatedCount++
							} else if (!_.isEqual(_.omitBy(fItem.entry, _.isNil), _.omitBy(item.entry, _.isNil))) {
								outOfSyncCount++
							}
						}
					})
				} else {
					availableCount++
				}
			})

			setUpdated(updatedCount)
			setOutOfSync(outOfSyncCount)
			setAvailable(availableCount)
		}
	}, [app.entries, app.items, params])

	const showAlert = updated + outOfSync + available > 0
	const alertOffset = showAlert ? 0 : -48

	const messages = []

	if (available > 0) {
		messages.push(`${available} not yet imported`)
	}

	if (updated > 0) {
		messages.push(`${updated} updated since last import`)
	}

	if (outOfSync > 0) {
		messages.push(`${outOfSync} out-of-sync`)
	}

	return (
		<Alert
			severity='info'
			onClick={() => app.setImportDrawerOpen && app.setImportDrawerOpen(true)}
			sx={{
				transition: '0.5s margin',
				marginTop: alertOffset + 'px',
				height: '36px',
				cursor: 'pointer'
			}}>
			Import panel has changes: {messages.join(', ')}
		</Alert>
	)
}

export default ImportAlert
