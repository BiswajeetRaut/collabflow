import { Button, Timeline } from 'flowbite-react';
import {HiCalendar} from 'react-icons/hi';
export default function Mentions() {
  return (
    <Timeline style={{
        borderLeft:`2px solid black`
    }}>
      <Timeline.Item>
        <Timeline.Point style={{zIndex:`950`}} className='point'/>
        <Timeline.Content>
          <Timeline.Time>
            February 2022
          </Timeline.Time>
          <Timeline.Title>
            Application UI code in Tailwind CSS
          </Timeline.Title>
          <Timeline.Body>
            <p>
              Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order
              E-commerce & Marketing pages.
            </p>
          </Timeline.Body>
        </Timeline.Content>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Point />
        <Timeline.Content>
          <Timeline.Time>
            March 2022
          </Timeline.Time>
          <Timeline.Title>
            Marketing UI design in Figma
          </Timeline.Title>
          <Timeline.Body>
            <p>
              All of the pages and components are first designed in Figma and we keep a parity between the two versions even
              as we update the project.
            </p>
          </Timeline.Body>
        </Timeline.Content>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Point />
        <Timeline.Content>
          <Timeline.Time>
            April 2022
          </Timeline.Time>
          <Timeline.Title>
            E-Commerce UI code in Tailwind CSS
          </Timeline.Title>
          <Timeline.Body>
            <p>
              Get started with dozens of web components and interactive elements built on top of Tailwind CSS.
            </p>
          </Timeline.Body>
        </Timeline.Content>
      </Timeline.Item>
    </Timeline>
  )
}


