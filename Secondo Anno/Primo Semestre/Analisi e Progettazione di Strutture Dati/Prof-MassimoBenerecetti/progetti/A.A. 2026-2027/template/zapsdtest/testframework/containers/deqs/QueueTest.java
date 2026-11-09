package zapsdtest.testframework.containers.deqs;

import apsd.interfaces.containers.deqs.Queue;

import zapsdtest.testframework.containers.base.ClearableContainerTest;
import zapsdtest.testframework.containers.base.InsertableContainerTest;

import static org.junit.jupiter.api.Assertions.*;

public interface QueueTest<Data, Con extends Queue<Con, Data>> extends ClearableContainerTest<Con>, InsertableContainerTest<Data, Con> {

  default void TestHead(Data expectedElement) {
    BeginTest("Head");
    Data head = ThisContainer().Head();
    assertEquals(expectedElement, head, "Head should return " + expectedElement);
    EndTest();
  }

  default void TestDequeue(boolean edgeCase) {
    BeginTest("Dequeue");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().Dequeue();
    if (edgeCase) {
      assertEquals(0, initialSize, "Initial size should be 0 after Dequeue on Empty Queue");
      assertEquals(0, ThisContainer().Size().ToLong(), "Size should stay 0 after Dequeue");
    } else {
      assertEquals(initialSize - 1, ThisContainer().Size().ToLong(), "Size should decrease by 1 after Dequeue");
    }
    EndTest();
  }

  default void TestHeadNDequeue(Data expectedElement, boolean edgeCase) {
    BeginTest("HeadNDequeue");
    long initialSize = ThisContainer().Size().ToLong();
    Data popped = ThisContainer().HeadNDequeue();
    assertEquals(expectedElement, popped, "HeadNDequeue should return " + expectedElement);
    if (edgeCase) {
      assertEquals(0, initialSize, "Initial size should be 0 after Dequeue on Empty Queue");
      assertEquals(0, ThisContainer().Size().ToLong(), "Size should stay 0 after HeadNDequeue");
    } else {
      assertEquals(initialSize - 1, ThisContainer().Size().ToLong(), "Size should decrease by 1 after HeadNDequeue");
    }
    EndTest();
  }

  default void TestEnqueue(Data element) {
    BeginTest("Enqueue");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().Enqueue(element);
    assertEquals(initialSize + 1, ThisContainer().Size().ToLong(), "Size should increase by 1 after Enqueue");
    EndTest();
  }

}
