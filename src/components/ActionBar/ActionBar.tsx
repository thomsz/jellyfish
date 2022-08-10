import { Button, Checkbox } from 'antd'

import { ViewMode } from '../types'
import type Ship from '../../types/Ship'
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

type ActionBarProps = {
  viewMode: ViewMode
  shipTypes: Set<Ship['type']>
  toggleViewMode: () => void
  selectShipTypes: (selectedShipTypes: Array<CheckboxValueType>) => void
  selectedShipTypes: Array<CheckboxValueType>
}

const viewModeButtonLabels = {
  [ViewMode.List]: ViewMode.Gallery,
  [ViewMode.Gallery]: ViewMode.List
}

const ActionBar = ({
  viewMode,
  shipTypes,
  toggleViewMode,
  selectShipTypes,
  selectedShipTypes
}: ActionBarProps) => {
  const allShipTypes = Array.from(shipTypes)
  const viewModeLabel = viewModeButtonLabels[viewMode].toLowerCase()

  return (
    <aside>
      <div className="sort-by-type">
        Sort by
        <Checkbox.Group
          value={selectedShipTypes}
          options={allShipTypes}
          onChange={selectShipTypes}
        />
      </div>
      <Button onClick={toggleViewMode}>Switch to {viewModeLabel} view</Button>
    </aside>
  )
}

export default ActionBar
