import type { Timeline } from '../../model/timeline.model';
import type { FindTimelinesProps } from './port/timeline-reader.input';

export interface TimelineReaderUseCaseInterface {
  findTimelines(args: FindTimelinesProps): Promise<Timeline[]>;
}
