import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Layout from './LayoutMultiColumn'

export default {
  title: 'Application/Organisms/Layouts/Examples/Multi-Column',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Layout>

export const Primary: ComponentStory<typeof Layout> = () => <Layout />
