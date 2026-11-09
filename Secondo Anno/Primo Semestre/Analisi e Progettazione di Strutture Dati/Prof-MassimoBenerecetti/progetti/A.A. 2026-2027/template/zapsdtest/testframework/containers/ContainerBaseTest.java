package zapsdtest.testframework.containers;

import apsd.interfaces.containers.base.Container;

import zapsdtest.testframework.containers.base.ContainerTest;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
abstract public class ContainerBaseTest<Con extends Container<Con>> implements ContainerTest<Con> {

  protected Con container = null;

  protected String name;

  protected int test = 0;

  static protected final AtomicInteger glbtestnum = new AtomicInteger(0);
  static protected final AtomicInteger glbtesttry = new AtomicInteger(0);
  static protected final AtomicInteger glbtestpos = new AtomicInteger(0);
  protected int loctestnum = 0;
  protected int loctesttry = 0;
  protected int loctestpos = 0;
  protected int unittestnum = 0;
  protected int unittesttry = 0;
  protected int unittestpos = 0;

  static protected final AtomicReference<Map<String, Integer>> maptestnum = new AtomicReference<>(new TreeMap<>());
  static protected final AtomicReference<Map<String, Integer>> maptesttry = new AtomicReference<>(new TreeMap<>());
  static protected final AtomicReference<Map<String, Integer>> maptestpos = new AtomicReference<>(new TreeMap<>());

  @Override
  public Con ThisContainer() { return container; }

  @Override
  public void BeginTest(String str) {
    unittesttry++;
    System.out.print("   - " + unittesttry + " Test " + str + ": ");
  };

  @Override
  public void EndTest() {
    unittestpos++;
    System.out.println("Ok!");
  }

  abstract public void NewEmptyContainer();
  abstract public void NewNonEmptyContainer();

  abstract public Con GetNewEmptyContainer();

  public void AddTest(int num) { unittestnum += num; }

  @BeforeAll
  public void BeforeAll() {
    System.out.println("Begin of all test units [" + this.getClass().getSimpleName() + "]");
    test = 0;
  }

  @BeforeEach
  public void BeforeEach() {
    test++;
    System.out.println(test + ") Begin of a single test unit");
    unittestnum = 0;
    unittesttry = 0;
    unittestpos = 0;
  }

  @AfterEach
  public void AfterEach() {
    loctestnum += unittestnum;
    loctesttry += unittesttry;
    loctestpos += unittestpos;
    int testerr = unittestnum - unittestpos;
    System.out.println(test + ") End of a single test unit (Errors/Try/Tests: " + testerr + "/" + unittesttry + "/" + unittestnum + ")");
  }

  @AfterAll
  public void AfterAll() {
    int loctesterr = loctestnum - loctestpos;
    System.out.println("End of all test units (Errors/Try/Tests: " + loctesterr + "/" + loctesttry + "/" + loctestnum + ")");
    System.out.println("****************************************************");
    maptestnum.get().put(name, loctestnum);
    maptesttry.get().put(name, loctesttry);
    maptestpos.get().put(name, loctestpos);
    glbtestnum.addAndGet(loctestnum);
    glbtesttry.addAndGet(loctesttry);
    glbtestpos.addAndGet(loctestpos);
    int glbtesterr = glbtestnum.get() - glbtestpos.get();
    System.out.println("Total test units up to now (Errors/Try/Tests: " + glbtesterr + "/" + glbtesttry + "/" + glbtestnum + ")");
    System.out.println("****************************************************");
    maptestnum.get().forEach(
      (str, tot) ->
        System.out.println(str + " (err/try/tot): " +
          (tot - maptestpos.get().get(str)) + "/"
          + maptesttry.get().get(str) + "/" + tot)
    );
    System.out.println("****************************************************\n");
  }

  @Nested
  @DisplayName("Container Basics")
  public class ContainerBasics {

    @Test
    @DisplayName("Checking Empty Container")
    public void Empty() {
      AddTest(4);
      NewEmptyContainer();
      TestEmpty();
      TestSize(0, false);
      TestIsEmpty(true, false);
      TestSizeIsEmptyConsistency();
    }

    @Test
    @DisplayName("Checking NonEmpty Container")
    public void NonEmpty() {
      AddTest(4);
      NewNonEmptyContainer();
      TestEmpty();
      TestSize(0, true);
      TestIsEmpty(false, false);
      TestSizeIsEmptyConsistency();
    }

  }

}
