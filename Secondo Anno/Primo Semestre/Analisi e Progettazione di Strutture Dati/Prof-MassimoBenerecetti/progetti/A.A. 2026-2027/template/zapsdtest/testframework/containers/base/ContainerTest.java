package zapsdtest.testframework.containers.base;

import apsd.interfaces.containers.base.Container;
import apsd.classes.utilities.Natural;

import static org.junit.jupiter.api.Assertions.*;

public interface ContainerTest<Con extends Container<Con>> {

  Con ThisContainer();

  void BeginTest(String str);
  void EndTest();

  default void TestEmpty() {
    BeginTest("Empty");
    Con con = ThisContainer().Empty();
    assertEquals(0L, con.Size().ToLong(), "Size should be 0");
    assertEquals(true, con.IsEmpty(), "IsEmpty should be true");
    EndTest();
  }

  default void TestSize(long expectedSize, boolean edgeCase) {
    BeginTest("Size");
    Natural size = ThisContainer().Size();
    assertNotNull(size, "Size() should not return null");
    if (edgeCase) {
      assertNotEquals(expectedSize, size.ToLong(), "Size should not be " + expectedSize);
    } else {
      assertEquals(expectedSize, size.ToLong(), "Size should be " + expectedSize);
    }
    EndTest();
  }

  default void TestIsEmpty(boolean expectedEmpty, boolean edgeCase) {
    BeginTest("IsEmpty");
    boolean isEmpty = ThisContainer().IsEmpty();
    if (edgeCase) {
      assertNotEquals(expectedEmpty, isEmpty, "IsEmpty should not be " + expectedEmpty);
    } else {
      assertEquals(expectedEmpty, isEmpty, "IsEmpty should be " + expectedEmpty);
    }
    EndTest();
  }

  default void TestSizeIsEmptyConsistency() {
    BeginTest("Size-IsEmpty Consistency");
    assertEquals(ThisContainer().Size().IsZero(), ThisContainer().IsEmpty(), "Size().IsZero() should equal IsEmpty()");
    EndTest();
  }

}
