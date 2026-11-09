package zapsdtest.testframework.containers.collections;

import apsd.classes.containers.collections.concretecollections.LLList;
import apsd.interfaces.containers.collections.Collection;
import apsd.interfaces.traits.Predicate;

import zapsdtest.testframework.containers.base.ClearableContainerTest;
import zapsdtest.testframework.containers.base.InsertableContainerTest;
import zapsdtest.testframework.containers.base.RemovableContainerTest;
import zapsdtest.testframework.containers.base.IterableContainerTest;

import static org.junit.jupiter.api.Assertions.*;

public interface CollectionTest<Data, Con extends Collection<Con, Data>> extends ClearableContainerTest<Con>, InsertableContainerTest<Data, Con>, RemovableContainerTest<Data, Con>, IterableContainerTest<Data, Con> {

  default void TestInsertIfAbsent(Data element, boolean shouldWork) {
    BeginTest("InsertIfAbsent");
    boolean result = ThisContainer().InsertIfAbsent(element);
    if (shouldWork) {
      assertTrue(result, "InsertIfAbsent should return true for " + element);
    } else {
      assertFalse(result, "InsertIfAbsent should return false for " + element);
    }
    EndTest();
  }

  default void TestRemoveOccurrences(Data element) {
    BeginTest("RemoveOccurrences");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().RemoveOccurrences(element);
    assertTrue(ThisContainer().Size().ToLong() <= initialSize, "Size should not increase after RemoveOccurrences");
    EndTest();
  }

  default void TestFilter(Predicate<Data> predicate) {
    BeginTest("Filter");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().Filter(predicate);
    assertTrue(ThisContainer().Size().ToLong() <= initialSize, "Size should not increase after Filter");
    EndTest();
  }

  default void TestUnion(Collection<?, Data> otherSet) {
    BeginTest("Union");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().Union(otherSet);
    assertTrue(ThisContainer().Size().ToLong() >= initialSize, "Size should not decrease after Union");
    if (otherSet != null) {
      assertTrue(otherSet.FoldForward((dat, acc) -> ThisContainer().Exists(dat) && acc, true), "The new set should contain all elements of the input set after Union");
    }
    EndTest();
  }

  default void TestDifference(Collection<?, Data> otherSet) {
    BeginTest("Difference");
    long initialSize = ThisContainer().Size().ToLong();
    LLList<Data> copy = new LLList<>(ThisContainer());
    LLList<Data> dupl = new LLList<>();
    while (!copy.IsEmpty()) {
      Data dat = copy.FirstNRemove();
      if (copy.Exists(dat)) dupl.InsertIfAbsent(dat);
    }
    ThisContainer().Difference(otherSet);
    assertTrue(ThisContainer().Size().ToLong() <= initialSize, "Size should not increase after Difference");
    if (otherSet != null) {
      assertFalse(otherSet.FoldForward((dat, acc) -> ThisContainer().Exists(dat) && !dupl.Exists(dat) || acc, false), "The new set should not contain any element of the input set after Differerence");
    }
    EndTest();
  }

  default void TestIntersection(Collection<?, Data> otherSet) {
    BeginTest("Intersection");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().Intersection(otherSet);
    assertTrue(ThisContainer().Size().ToLong() <= initialSize, "Size should not increase after Intersection");
    if (otherSet != null) {
      assertTrue(ThisContainer().FoldForward((dat, acc) -> otherSet.Exists(dat) && acc, true), "The input set should contain all elements of the new set after Intersection");
    }
    EndTest();
  }

}
