import { List, Image } from 'antd'

import fallbackImage from '../../assets/jack-sparrow.jpg'

import { ListItem } from '../types'

type ShipListProps = {
  items: Array<ListItem>
}

const ShipList = ({ items }: ShipListProps) => {
  return (
    <List
      rowKey={item => item.id}
      loading={items.length === 0}
      dataSource={items}
      itemLayout="vertical"
      renderItem={item => (
        <List.Item
          key={item.id}
          className="list-item"
          extra={
            <Image
              alt={item.name}
              src={item.image || String(fallbackImage)}
              width={300}
            />
          }
        >
          <List.Item.Meta
            title={item.title}
            description={item.description}
          />
        </List.Item>
      )}
    />
  )
}

export default ShipList
