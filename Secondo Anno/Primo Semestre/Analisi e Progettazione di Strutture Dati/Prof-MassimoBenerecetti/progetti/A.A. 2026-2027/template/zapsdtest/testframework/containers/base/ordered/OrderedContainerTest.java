package zapsdtest.testframework.containers.base.ordered;

import static org.junit.jupiter.api.Assertions.*;

import apsd.interfaces.containers.base.ordered.OrderedContainer;

import zapsdtest.testframework.containers.base.MembershipContainerTest;

public interface OrderedContainerTest<Data extends Comparable<? super Data>, Con extends OrderedContainer<Con, Data>> extends MembershipContainerTest<Data, Con> {

  default void TestMin(Data expectedElement) {
    BeginTest("Min");
    Data min = ThisContainer().Min();
    assertEquals(expectedElement, min, "Min should return " + expectedElement);
    EndTest();
  }

  default void TestMax(Data expectedElement) {
    BeginTest("Max");
    Data max = ThisContainer().Max();
    assertEquals(expectedElement, max, "Max should return " + expectedElement);
    EndTest();
  }

  default void TestPredecessor(Data element, Data expectedElement) {
    BeginTest("Predecessor");
    Data pred = ThisContainer().Predecessor(element);
    assertEquals(expectedElement, pred, "Predecessor should return " + expectedElement);
    EndTest();
  }

  default void TestSuccessor(Data element, Data expectedElement) {
    BeginTest("Successor");
    Data succ = ThisContainer().Successor(element);
    assertEquals(expectedElement, succ, "Successor should return " + expectedElement);
    EndTest();
  }

}
