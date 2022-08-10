import { Card, Image } from 'antd'

import fallbackImage from '../../assets/jack-sparrow.jpg'

import { ListItem } from '../types'

type ShipGalleryProps = {
  items: Array<ListItem>
}

const ShipGallery = ({ items }: ShipGalleryProps) => {
  return (
    <div className="gallery">
      {
        items.map((item: ListItem) => (
          <Card
            key={item.id}
            className="card"
            cover={
              <Image
                alt={item.name}
                src={item.image || String(fallbackImage)}
                style={{
                  height: '12rem',
                  objectFit: 'cover'
                }}
              />
            }
          >
            <Card.Meta
              title={item.title}
              description={item.description}
            />
          </Card>
        ))
      }
    </div>
  )
}

export default ShipGallery
