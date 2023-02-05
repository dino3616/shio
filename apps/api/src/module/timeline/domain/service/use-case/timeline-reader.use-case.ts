import { Timeline } from '../../model/timeline.model';
import { FindTimelinesProps } from './port/timeline-reader.input';

export interface TimelineReaderUseCaseInterface {
  findTimelines(args: FindTimelinesProps): Promise<Timeline[]>;
}
