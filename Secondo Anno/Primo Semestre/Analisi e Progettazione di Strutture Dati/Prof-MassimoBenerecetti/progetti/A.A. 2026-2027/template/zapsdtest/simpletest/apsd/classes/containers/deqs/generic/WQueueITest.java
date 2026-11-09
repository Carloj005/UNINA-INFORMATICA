package zapsdtest.simpletest.apsd.classes.containers.deqs.generic;

import apsd.interfaces.containers.deqs.Queue;

import org.junit.jupiter.api.*;

abstract public class WQueueITest<Con extends Queue<Con, Long>> extends WQueueTest<Con, Long> {

  @Override
  public void NewNonEmptyContainer() {
    AddTest(6);
    NewEmptyContainer();
    TestEnqueue(4L);
    TestInsert(0L, true);
    TestEnqueue(3L);
    TestInsert(1L, true);
    TestEnqueue(2L);
    TestSize(5, false);
  }

  @Nested
  @DisplayName("Queue Basics")
  public class QueueBasics {

    @Test
    @DisplayName("Check starting from an Empty Queue")
    public void Empty() {
      AddTest(3);
      NewEmptyContainer();
      TestHead(null);
      TestDequeue(true);
      TestHeadNDequeue(null, true);
    }

    @Test
    @DisplayName("Check starting from a NonEmpty Queue")
    public void NonEmpty() {
      AddTest(11);
      NewNonEmptyContainer();
      TestSize(4, true);
      TestHeadNDequeue(4L, false);
      TestHead(0L);
      TestEnqueue(5L);
      TestEnqueue(6L);
      TestHead(0L);
      TestHeadNDequeue(0L, false);
      TestDequeue(false);
      TestHead(1L);
      TestClear();
      TestHeadNDequeue(null, true);
    }

  }

}
