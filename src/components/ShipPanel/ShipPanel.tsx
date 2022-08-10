import request from 'axios'
import { useState, useEffect } from 'react'

import ShipList from './ShipList'
import ActionBar from '../ActionBar/ActionBar'
import ShipGallery from './ShipGallery'
import InfiniteScroll from 'react-infinite-scroll-component'
import { message, Divider } from 'antd'

import Ship from '../../types/Ship'
import { ViewMode, ListItem } from '../types'
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

const itemQuery = {
  INTERVAL: 5,
  INITIAL_LIMIT: 10
}

const ShipListPanel = () => {
  const [ships, setShips] = useState<Array<Ship>>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState(ViewMode.List)
  const [shipTypes, setShipTypes] = useState<Set<Ship['type']>>(new Set())
  const [hasMoreShips, setHasMoreShips] = useState(true)
  const [shipQueryLimit, setShipQueryLimit] = useState(itemQuery.INITIAL_LIMIT)
  const [shipQueryOffset, setShipQueryOffset] = useState(0)
  const [selectedShipTypes, setSelectedShipTypes] = useState<Array<CheckboxValueType>>([])

  const fetchShips = async () => {
    setLoading(true)

    const collectShipTypes = (newShips: Array<Ship>) => {
      const newShipTypes = new Set<string>()
      newShips.forEach((ship: Ship) => newShipTypes.add(ship.type))
      setShipTypes(shipTypes => new Set([...shipTypes, ...newShipTypes]))
      setSelectedShipTypes(shipTypes => [...shipTypes, ...newShipTypes])
    }

    try {
      const requestUrl = `https://api.spacex.land/rest/ships/?limit=${shipQueryLimit}&offset=${shipQueryOffset}`
      const response = await request.get(requestUrl)
      const newShips: Array<Ship> = response.data
      const updatedShips = [...ships, ...newShips]

      setShips(updatedShips)
      collectShipTypes(newShips)
      
      if (shipQueryOffset < itemQuery.INITIAL_LIMIT) {
        setShipQueryLimit(itemQuery.INTERVAL)
        setShipQueryOffset(shipQueryOffset => shipQueryOffset + itemQuery.INITIAL_LIMIT)
      } else {
        setShipQueryOffset(shipQueryOffset => shipQueryOffset + itemQuery.INTERVAL)
      }
      
      if (newShips.length < itemQuery.INTERVAL) {
        setHasMoreShips(false)
        message.info('Loaded all ships', 2)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const selectShipTypes = (selectedShipTypes: Array<CheckboxValueType>) => {
    setSelectedShipTypes(selectedShipTypes)
  }

  const filteredShips = ships.filter((ship: Ship) => {
    return selectedShipTypes.includes(ship.type)
  })

  const listItems: Array<ListItem> = filteredShips.map((ship: Ship) => {
    const { id, name, type, image, roles, home_port } = ship
    return {
      id,
      name,
      image,
      title: `${name} (${type})`,
      description: `${roles.join(', ')} | ${home_port}`
    }
  })

  const toggleViewMode = () => {
    switch (viewMode) {
      case ViewMode.List:
        setViewMode(ViewMode.Gallery)
        return
    
      case ViewMode.Gallery:
        setViewMode(ViewMode.List)
        return

      default:
        break
    }
  }

  useEffect(() => {
    fetchShips()
  }, [])
  
  useEffect(() => {
    const LOADING_MESSAGE_KEY = 'loading'
    const triggerLoadingMessage = () => {
      message.loading({
        key: LOADING_MESSAGE_KEY,
        content: 'Loading...'
      })
    }

    const closeLoadingMessage = () => {
      message.success({
        key: LOADING_MESSAGE_KEY,
        content: 'Loaded',
        duration: 1
      })
    }

    loading ? triggerLoadingMessage() : closeLoadingMessage()
  }, [loading])

  return (
    <>
      <ActionBar
        viewMode={viewMode}
        shipTypes={shipTypes}
        toggleViewMode={toggleViewMode}
        selectShipTypes={selectShipTypes}
        selectedShipTypes={selectedShipTypes}
      />
      <main>
        {
          listItems.length > 0
            ? <InfiniteScroll
                next={fetchShips}
                loader={<Divider plain>Loading...</Divider>}
                hasMore={hasMoreShips}
                dataLength={listItems.length}
              >
                {
                  viewMode === ViewMode.List
                    ? <ShipList items={listItems} />
                    : <ShipGallery items={listItems} />
                }
              </InfiniteScroll>
            : <div
                style={{
                  padding: '2rem',
                  textAlign: 'center'
                }}
              >
                No ships to display
              </div>
        }
      </main>
    </>
  )
}

export default ShipListPanel
