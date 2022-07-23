import { warn } from 'console'

warn('\n🧪 delegates:')
import './delegate/delegate-add.test'
import './delegate/delegate-call.test'
import './delegate/delegate-delete.test'
import './delegate/delegate-has.test'

warn('\n🧪 events:')
import './event/event-call.test'
import './event/event-delete.test'
import './event/event-has.test'

warn('\n🧪 iterator result values:')
import './iterator-result-value/iterator-result-value-value.test'

warn('\n🧪 vectors:')
import './vector/vector-apply.test'
import './vector/vector-key.test'
import './vector/vector-keys.test'

warn('\n🧪 streams:')
import './stream/stream-delete-async.test'
import './stream/stream-await-async.test'
